import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import ElectionCandidate from "../../models/ElectionCandidate.models";

dotenv.config();

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration with file filtering
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Validation middleware
const validateCandidateInput = (req, res, next) => {
    const { name, email, regNo, year, branch, position } = req.body;
    
    if (!name || !email || !regNo || !year || !branch || !position) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    next();
};

// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (file, folder) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: `electionForms/${folder}`,
            public_id: `${Date.now()}-${file.originalname}`,
            format: 'png',
        });
        await fs.unlink(file.path);
        return result.secure_url;
    } catch (error) {
        await fs.unlink(file.path); // Clean up file even if upload fails
        throw new Error(`Failed to upload ${folder}: ${error.message}`);
    }
};

// Main route handler
router.post(
    '/api/candidates/submit',
    upload.fields([
        { name: 'scoreCard', maxCount: 1 },
        { name: 'profileImage', maxCount: 1 }
    ]),
    validateCandidateInput,
    async (req, res) => {
        const { name, email, regNo, year, branch, position } = req.body;
        const files = req.files;

        try {
            // Validate file uploads
            if (!files.scoreCard || !files.profileImage) {
                throw new Error('Both scoreCard and profileImage are required');
            }

            // Upload files to Cloudinary
            const [scoreCardUrl, profileImageUrl] = await Promise.all([
                uploadToCloudinary(files.scoreCard[0], 'scorecards'),
                uploadToCloudinary(files.profileImage[0], 'profiles')
            ]);

            // Create and save new candidate
            const newCandidate = new ElectionCandidate({
                name,
                email,
                regNo,
                year,
                branch,
                position,
                scorecard: scoreCardUrl,
                image: profileImageUrl,
                status: 'pending',
                submittedAt: new Date()
            });

            const savedCandidate = await newCandidate.save();
            
            res.status(201).json({
                message: 'Candidate submission successful',
                candidate: savedCandidate
            });

        } catch (error) {
            // Clean up any uploaded files if they exist
            if (files) {
                for (const fileArray of Object.values(files)) {
                    for (const file of fileArray) {
                        try {
                            await fs.unlink(file.path);
                        } catch (unlinkError) {
                            console.error('Error deleting file:', unlinkError);
                        }
                    }
                }
            }

            console.error('Submission error:', error);
            res.status(500).json({
                error: 'Candidate submission failed',
                message: error.message
            });
        }
    }
);

export default router;