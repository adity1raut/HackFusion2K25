import express from 'express';
import Faculty from "../../models/FacultyUse.models.js"
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import authenticateToken from '../../middleware/Auth.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Faculty Login
const login = async (req, res) => {
    const { email, password, type } = req.body;

    try {
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

        const isMatch = await faculty.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid email or password' 
            });
        }

        const token = jwt.sign(
            { 
                userId: faculty._id, 
                email: faculty.email, 
                type: faculty.type
            },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            token,
            email: faculty.email,
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

// Get Faculty Profile
const profile = async (req, res) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({ 
                success: false,
                message: 'Email is required.' 
            });
        }

        const faculty = await Faculty.findOne({ email }).select('-password');
        
        if (!faculty) {
            return res.status(404).json({ 
                success: false,
                message: 'Faculty not found.' 
            });
        }

        res.status(200).json({
            success: true,
            data: faculty
        });
    } catch (error) {
        console.error('Error fetching faculty profile:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error, please try again later.' 
        });
    }
};

// Update Faculty Profile
const updateProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const { 
            name, 
            department, 
            designation, 
            specialization,
            experience 
        } = req.body;
        const profileImage = req.file;

        const faculty = await Faculty.findOne({ email });
        
        if (!faculty) {
            return res.status(404).json({ 
                success: false,
                message: 'Faculty not found.' 
            });
        }

        // Update fields if provided
        if (name) faculty.name = name;
        if (department) faculty.department = department;
        if (designation) faculty.designation = designation;
        if (specialization) faculty.specialization = specialization;
        if (experience) faculty.experience = Number(experience);

        // Handle profile image upload
        if (profileImage) {
            const uploadResponse = await cloudinary.uploader.upload(profileImage.path, {
                folder: 'faculty_profiles',
                use_filename: true,
                unique_filename: false,
            });
            faculty.profile = uploadResponse.secure_url;
        }

        await faculty.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            data: faculty
        });
    } catch (error) {
        console.error('Error updating faculty profile:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error, please try again later.' 
        });
    }
};

// Routes
router.post('/api/faculty/login', login);
router.get('/api/faculty/profile/:email', authenticateToken, profile);
router.put('/api/faculty/profile/:email', authenticateToken, upload.single('profileImage'), updateProfile);

export default router;