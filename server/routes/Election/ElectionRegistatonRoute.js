import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs/promises';
import ElectionCandidate, { validationConstants } from "../../models/ElectionCandidate.js";

dotenv.config();

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Configuration
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
        cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Helper Function to Upload File to Cloudinary
const uploadToCloudinary = async (file, folder) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: `electionForms/${folder}`,
            public_id: `${Date.now()}-${file.originalname}`,
        });
        await fs.unlink(file.path); // Delete the file from the server after upload
        return result.secure_url;
    } catch (error) {
        await fs.unlink(file.path); // Clean up the file if upload fails
        throw new Error(`Failed to upload ${folder}: ${error.message}`);
    }
};

// Validation Middleware
const validateCandidateInput = (req, res, next) => {
    const { name, email, regNo, year, branch, position } = req.body;

    // Check for required fields
    const requiredFields = { name, email, regNo, year, branch, position };
    const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([field]) => field);

    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            error: {
                code: 400,
                message: `Missing required fields: ${missingFields.join(', ')}`,
                type: 'ValidationError'
            }
        });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            error: {
                code: 400,
                message: 'Please enter a valid email',
                type: 'ValidationError'
            }
        });
    }

    // Validate year (case-insensitive)
    if (!validationConstants.VALID_YEARS.includes(year.toLowerCase())) {
        return res.status(400).json({
            success: false,
            error: {
                code: 400,
                message: `Invalid academic year. Must be one of: ${validationConstants.VALID_YEARS.join(', ')}`,
                type: 'ValidationError'
            }
        });
    }

    // Validate branch (case-sensitive)
    if (!validationConstants.VALID_BRANCHES.includes(branch)) {
        return res.status(400).json({
            success: false,
            error: {
                code: 400,
                message: `Invalid branch. Must be one of: ${validationConstants.VALID_BRANCHES.join(', ')}`,
                type: 'ValidationError'
            }
        });
    }

    // Validate position (exact match)
    if (!validationConstants.VALID_POSITIONS.includes(position)) {
        return res.status(400).json({
            success: false,
            error: {
                code: 400,
                message: `Invalid position. Must be one of: ${validationConstants.VALID_POSITIONS.join(', ')}`,
                type: 'ValidationError'
            }
        });
    }

    next();
};

// Route to Submit Candidate
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
            // Validate files
            if (!files || !files.scoreCard || !files.profileImage) {
                throw new Error('Both scoreCard and profileImage are required');
            }

            // Check for existing candidate
            const existingCandidate = await ElectionCandidate.findOne({
                $or: [
                    { email: email.toLowerCase() },
                    { regNo: regNo.toUpperCase() }
                ]
            });

            if (existingCandidate) {
                const duplicateField = existingCandidate.email === email.toLowerCase() ? 'email' : 'registration number';
                throw new Error(`A candidate with this ${duplicateField} already exists`);
            }

            // Upload files to Cloudinary
            const [scoreCardUrl, profileImageUrl] = await Promise.all([
                uploadToCloudinary(files.scoreCard[0], 'scorecards'),
                uploadToCloudinary(files.profileImage[0], 'profiles')
            ]);

            // Create new candidate
            const candidateData = {
                name: name.trim(),
                email: email.toLowerCase(),
                regNo: regNo.toUpperCase(),
                year: year.toLowerCase(),
                branch: branch,
                position: position,
                scorecard: scoreCardUrl,
                image: profileImageUrl,
                status: 'pending',
                votes: 0
            };

            const newCandidate = new ElectionCandidate(candidateData);
            const savedCandidate = await newCandidate.save();

            // Success response
            res.status(201).json({
                success: true,
                message: 'Candidate submission successful',
                data: savedCandidate
            });

        } catch (error) {
            // Clean up uploaded files on error
            if (files) {
                await Promise.all(
                    Object.values(files).flat().map(file =>
                        fs.unlink(file.path).catch(err =>
                            console.error(`Failed to delete file ${file.path}:`, err)
                    ))
                );
            }

            // Error response
            const statusCode = error.code === 11000 ? 409 :
                error.message.includes('required') ? 400 :
                error.message.includes('validation') ? 422 : 500;

            res.status(statusCode).json({
                success: false,
                error: {
                    code: statusCode,
                    message: error.message,
                    type: statusCode === 409 ? 'DuplicateEntry' :
                        statusCode === 400 ? 'ValidationError' :
                        statusCode === 422 ? 'ProcessingError' : 'ServerError'
                }
            });
        }
    }
);

const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
        next(err);
    });
};

router.get('/api/candidates/selected', asyncHandler(async (req, res, next) => {
    const approvedCandidates = await ElectionCandidate.find({
        status: "approved"
    }).select('-__v');

    if (!approvedCandidates.length) {
        return res.status(404).json({
            success: false,
            message: "No approved candidates found"
        });
    }

    res.status(200).json({
        success: true,
        count: approvedCandidates.length,
        data: approvedCandidates
    });
}));

// Get all candidates route// GET all election candidates with pagination
router.get('/api/candidates/selected', async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // Default values for page and limit
    const options = {
        page: Number(page),
        limit: Number(limit)
    };

    try {
        const candidates = await ElectionCandidate.find()
            .skip((options.page - 1) * options.limit)
            .limit(options.limit);

        const totalCount = await ElectionCandidate.countDocuments();

        res.status(200).json({
            success: true,
            data: candidates,
            count: totalCount,
            totalPages: Math.ceil(totalCount / options.limit)
        });
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve candidates" });
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
const deleteFromCloudinary = async (url) => {
    try {
        const publicId = url.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy(`electionForms/${publicId}`);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
    }
};

// Admin route to update candidate status with remarks
router.patch('/api/admin/candidates/:id/status', async (req, res) => {
    const { status, remarks } = req.body;

    if (!validationConstants.VALID_STATUSES.includes(status)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid status'
        });
    }

    try {
        const candidate = await ElectionCandidate.findByIdAndUpdate(
            req.params.id,
            {
                status,
                remarks: remarks || '',
                reviewedAt: new Date()
            },
            { new: true, runValidators: true }
        );

        if (!candidate) {
            return res.status(404).json({
                success: false,
                error: 'Candidate not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `Candidate status updated to ${status}`,
            data: candidate
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to update candidate status',
            message: error.message
        });
    }
});

// Admin route to delete candidate
router.delete('/api/admin/candidates/:id', async (req, res) => {
    try {
        const candidate = await ElectionCandidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({
                success: false,
                error: 'Candidate not found'
            });
        }

        // Delete files from Cloudinary
        await Promise.all([
            deleteFromCloudinary(candidate.scorecard),
            deleteFromCloudinary(candidate.image)
        ]);

        // Delete candidate from database
        await ElectionCandidate.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Candidate deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to delete candidate',
            message: error.message
        });
    }
});

// Admin route to update candidate registration
router.put('/api/admin/candidates/:id',
    upload.fields([
        { name: 'scoreCard', maxCount: 1 },
        { name: 'profileImage', maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const candidateId = req.params.id;
            const updateData = { ...req.body };
            const files = req.files;

            // Validate the update data
            if (updateData.year && !validationConstants.VALID_YEARS.includes(updateData.year)) {
                throw new Error('Invalid academic year');
            }
            if (updateData.branch && !validationConstants.VALID_BRANCHES.includes(updateData.branch)) {
                throw new Error('Invalid branch');
            }
            if (updateData.position && !validationConstants.VALID_POSITIONS.includes(updateData.position)) {
                throw new Error('Invalid position');
            }

            // Get existing candidate
            const existingCandidate = await ElectionCandidate.findById(candidateId);
            if (!existingCandidate) {
                throw new Error('Candidate not found');
            }

            // Handle file updates if provided
            if (files.scoreCard?.[0]) {
                const scoreCardUrl = await uploadToCloudinary(files.scoreCard[0], 'scorecards');
                await deleteFromCloudinary(existingCandidate.scorecard);
                updateData.scorecard = scoreCardUrl;
            }

            if (files.profileImage?.[0]) {
                const profileImageUrl = await uploadToCloudinary(files.profileImage[0], 'profiles');
                await deleteFromCloudinary(existingCandidate.image);
                updateData.image = profileImageUrl;
            }

            // Update candidate
            const updatedCandidate = await ElectionCandidate.findByIdAndUpdate(
                candidateId,
                updateData,
                { new: true, runValidators: true }
            );

            res.status(200).json({
                success: true,
                message: 'Candidate updated successfully',
                data: updatedCandidate
            });
        } catch (error) {
            // Clean up any uploaded files
            if (req.files) {
                await Promise.all(
                    Object.values(req.files).flat().map(file =>
                        fs.unlink(file.path).catch(console.error)
                    )
                );
            }

            res.status(error.message === 'Candidate not found' ? 404 : 500).json({
                success: false,
                error: 'Failed to update candidate',
                message: error.message
            });
        }
    }
);

// Admin route to get candidates with filters
router.get('/api/admin/candidates', async (req, res) => {
    try {
        const { status, year, branch, position, search } = req.query;

        // Build filter object
        const filter = {};

        if (status) filter.status = status;
        if (year) filter.year = year;
        if (branch) filter.branch = branch;
        if (position) filter.position = position;

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { regNo: { $regex: search, $options: 'i' } }
            ];
        }

        const candidates = await ElectionCandidate.find(filter)
            .select('-__v')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: candidates.length,
            data: candidates
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch candidates',
            message: error.message
        });
    }
});

router.get("/api/election-candidates", async (req, res) => {
    try {
        const candidates = await ElectionCandidate.find(); // Fetch all candidates
        if (candidates.length === 0) {
            return res.status(404).json({ message: "No candidates found" });
        }
        res.status(200).json(candidates); // Return all candidates
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(500).json({ message: "Failed to fetch candidates" });
    }
});

export default router;