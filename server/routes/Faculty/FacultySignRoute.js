import express from 'express';
import Faculty from '../../models/FacultyUse.models.js';
import dotenv from 'dotenv';
import transporter from "../../config/NodeMailer.js";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

dotenv.config();
const router = express.Router();

// Store for both OTP and temporary faculty data
const otpStore = new Map();
const tempFacultyStore = new Map();

// Clear expired data periodically
setInterval(() => {
    const now = Date.now();
    for (const [email, data] of otpStore.entries()) {
        if (now > data.expiresAt) {
            otpStore.delete(email);
            tempFacultyStore.delete(email);
        }
    }
}, 5 * 60 * 1000);

const generateOTP = () => {
    const otp = crypto.randomInt(100000, 999999).toString();
    return {
        code: otp,
        expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
    };
};

const validateFacultyInput = (data) => {
    const errors = {};
    
    if (!data.name || data.name.length < 2) {
        errors.name = 'Valid name is required';
    }
    
    if (!data.email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
        errors.email = 'Valid email is required';
    }
    
    if (!data.department) {
        errors.department = 'Department is required';
    }
    
    if (!data.designation) {
        errors.designation = 'Designation is required';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Initial signup endpoint - Only sends OTP
router.post('/api/faculty/send-otp', async (req, res) => {
    try {
        const { name, email, department, designation, specialization, experience, type } = req.body;

        // Validate input
        const validation = validateFacultyInput(req.body);
        if (!validation.isValid) {
            return res.status(400).json({
                success: false,
                errors: validation.errors
            });
        }

        // Check if faculty already exists
        const existingFaculty = await Faculty.findOne({ email });
        if (existingFaculty) {
            return res.status(400).json({
                success: false,
                message: 'Faculty member with this email already exists'
            });
        }

        // Generate and store OTP
        const otpData = generateOTP();
        otpStore.set(email, otpData);

        // Store faculty data temporarily
        tempFacultyStore.set(email, {
            name,
            email,
            department,
            designation,
            specialization,
            experience: Number(experience),
            type
        });

        // Send OTP email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Faculty Registration',
            html: `
                <h2>Welcome to Our Faculty Portal</h2>
                <p>Your OTP for registration is: <strong>${otpData.code}</strong></p>
                <p>This OTP will expire in 10 minutes.</p>
                <p>If you didn't request this registration, please ignore this email.</p>
            `
        };
        console.log(otpData.code);

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully. Please verify to continue registration.'
        });
    } catch (error) {
        console.error('Send OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending OTP. Please try again.'
        });
    }
});

// Verify OTP and create faculty with password
router.post('/api/faculty/verify-and-register', async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        // Check if OTP exists
        const otpData = otpStore.get(email);
        if (!otpData) {
            return res.status(400).json({
                success: false,
                message: 'No OTP found or OTP expired. Please request a new one.'
            });
        }

        // Verify OTP
        if (otpData.code !== otp) {
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

        // Check if OTP has expired
        if (Date.now() > otpData.expiresAt) {
            otpStore.delete(email);
            tempFacultyStore.delete(email);
            return res.status(400).json({
                success: false,
                message: 'OTP has expired. Please request a new one.'
            });
        }

        // Validate password
        if (!password || password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Get stored faculty data
        const facultyData = tempFacultyStore.get(email);
        if (!facultyData) {
            return res.status(400).json({
                success: false,
                message: 'Registration data not found. Please start registration again.'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save faculty
        const faculty = new Faculty({
            ...facultyData,
            password: hashedPassword,
            isVerified: true
        });

        await faculty.save();

        // Clear stored data
        otpStore.delete(email);
        tempFacultyStore.delete(email);

        res.status(201).json({
            success: true,
            message: 'Faculty registration completed successfully. You can now login.'
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during registration. Please try again.'
        });
    }
});

// Resend OTP endpoint
router.post('/api/faculty/resend-otp', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if temporary faculty data exists
        const facultyData = tempFacultyStore.get(email);
        if (!facultyData) {
            return res.status(400).json({
                success: false,
                message: 'Registration data not found. Please start registration again.'
            });
        }

        // Generate new OTP
        const otpData = generateOTP();
        otpStore.set(email, otpData);

        // Send new OTP email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your New OTP for Faculty Registration',
            html: `
                <h2>New OTP for Faculty Portal</h2>
                <p>Your new OTP for registration is: <strong>${otpData.code}</strong></p>
                <p>This OTP will expire in 10 minutes.</p>
                <p>If you didn't request this OTP, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'New OTP has been sent to your email.'
        });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({
            success: false,
            message: 'Error sending new OTP. Please try again.'
        });
    }
});

// Login endpoint
router.post('/api/faculty/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find faculty and include password field
        const faculty = await Faculty.findOne({ email }).select('+password');
        if (!faculty) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if faculty is verified
        if (!faculty.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Please verify your email before logging in'
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, faculty.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token (assuming you have a JWT implementation)
        const token = faculty.generateAuthToken(); // Implement this method in your Faculty model

        res.status(200).json({
            success: true,
            token,
            email: faculty.email,
            name: faculty.name
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login. Please try again.'
        });
    }
});

export default router;