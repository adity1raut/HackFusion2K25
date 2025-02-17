import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import ElectionCandidate, { validationConstants } from "../../models/ElectionCandidate.js"

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG and JPG are allowed.'), false);
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
    
    // Check for required fields
    if (!name || !email || !regNo || !year || !branch || !position) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Validate year
    if (!validationConstants.VALID_YEARS.includes(year)) {
        return res.status(400).json({ error: 'Invalid academic year' });
    }

    // Validate branch
    if (!validationConstants.VALID_BRANCHES.includes(branch)) {
        return res.status(400).json({ error: 'Invalid branch' });
    }

    // Validate position
    if (!validationConstants.VALID_POSITIONS.includes(position)) {
        return res.status(400).json({ error: 'Invalid position' });
    }

    next();
};

// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (file, folder) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: `electionForms/${folder}`,
            public_id: `${Date.now()}-${file.originalname}`,
        });
        await fs.unlink(file.path);
        return result.secure_url;
    } catch (error) {
        await fs.unlink(file.path);
        throw new Error(`Failed to upload ${folder}: ${error.message}`);
    }
};

// Create new candidate route
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
            if (!files.scoreCard?.[0] || !files.profileImage?.[0]) {
                throw new Error('Both scoreCard and profileImage are required');
            }

            // Check if candidate already exists
            const existingCandidate = await ElectionCandidate.findOne({
                $or: [{ email }, { regNo }]
            });

            if (existingCandidate) {
                throw new Error('A candidate with this email or registration number already exists');
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
                image: profileImageUrl
            });

            const savedCandidate = await newCandidate.save();
            
            res.status(201).json({
                message: 'Candidate submission successful',
                candidate: savedCandidate
            });

        } catch (error) {
            // Clean up any uploaded files
            if (files) {
                await Promise.all(
                    Object.values(files).flat().map(file => 
                        fs.unlink(file.path).catch(console.error)
                    )
                );
            }

            res.status(error.code === 11000 ? 409 : 500).json({
                error: 'Candidate submission failed',
                message: error.message
            });
        }
    }
);

// Get all candidates route
router.get('/api/candidates', async (req, res) => {
    try {
        const candidates = await ElectionCandidate.find()
            .select('-__v')
            .sort({ createdAt: -1 });
        
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch candidates',
            message: error.message
        });
    }
});

// Get candidate by ID route
router.get('/api/candidates/:id', async (req, res) => {
    try {
        const candidate = await ElectionCandidate.findById(req.params.id)
            .select('-__v');
        
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        
        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch candidate',
            message: error.message
        });
    }
});

// Update candidate status route
router.patch('/api/candidates/:id/status', async (req, res) => {
    const { status } = req.body;
    
    if (!validationConstants.VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    
    try {
        const candidate = await ElectionCandidate.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).select('-__v');
        
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        
        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to update candidate status',
            message: error.message
        });
    }
});

export default router;