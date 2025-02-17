import express from 'express';
import Faculty from "../../models/FacultyUse.models.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

// Faculty Login
const login = async (req, res) => {
    const { email, password, type } = req.body;

    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find faculty by email
        const faculty = await Faculty.findOne({ email });
        
        if (!faculty) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        if (faculty.type !== type) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user type'
            });
        }

        // Check if faculty is verified
        if (!faculty.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Please verify your email before logging in'
            });
        }

        // Compare password using bcrypt
        const isMatch = await bcrypt.compare(password, faculty.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: faculty._id,
                email: faculty.email,
                type: faculty.type
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send response without password
        const facultyWithoutPassword = faculty.toObject();
        delete facultyWithoutPassword.password;

        res.status(200).json({
            success: true,
            token,
            faculty: facultyWithoutPassword,
            message: 'Login successful'
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

router.post('/api/faculty/login', login);

export default router;
