import express from 'express';
import { body, validationResult } from 'express-validator';
import FacultyAvailability from '../models/Faculty.models';

const router = express.Router();


const validateTimeSlots = (timeSlots) => {
    if (!Array.isArray(timeSlots)) return false;
    return timeSlots.every(slot => {
        if (!slot.start || !slot.end) return false;
        // Basic time format validation (HH:MM AM/PM)
        const timeFormat = /^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/;
        return timeFormat.test(slot.start) && timeFormat.test(slot.end);
    });
};

// Create faculty availability
router.post(
    '/api/faculty-availability',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phone').trim().notEmpty().withMessage('Phone number is required'),
        body('department').trim().notEmpty().withMessage('Department is required'),
        body('designation').trim().notEmpty().withMessage('Designation is required'),
        body('dayOfWeek')
            .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
            .withMessage('Valid day of week is required'),
        body('availableTimeSlots').isArray().withMessage('Time slots must be an array'),
    ],
    async (req, res) => {
        try {
            // Validate request
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            // Validate time slots format
            if (!validateTimeSlots(req.body.availableTimeSlots)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid time slot format'
                });
            }

            // Check for existing faculty availability on same day
            const existingAvailability = await FacultyAvailability.findOne({
                email: req.body.email,
                dayOfWeek: req.body.dayOfWeek
            });

            if (existingAvailability) {
                return res.status(400).json({
                    success: false,
                    message: 'Faculty availability already exists for this day'
                });
            }

            const facultyAvailability = new FacultyAvailability(req.body);
            await facultyAvailability.save();

            res.status(201).json({
                success: true,
                message: 'Faculty availability created successfully',
                data: facultyAvailability
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating faculty availability',
                error: error.message
            });
        }
    }
);

// Get all faculty availabilities
router.get('/api/faculty-availability', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter options
        const filter = {};
        if (req.query.department) filter.department = req.query.department;
        if (req.query.dayOfWeek) filter.dayOfWeek = req.query.dayOfWeek;

        const availabilities = await FacultyAvailability.find(filter)
            .sort({ department: 1, dayOfWeek: 1 })
            .skip(skip)
            .limit(limit);

        const total = await FacultyAvailability.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: availabilities,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalRecords: total,
                recordsPerPage: limit
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching faculty availabilities',
            error: error.message
        });
    }
});

// Get faculty availability by ID
router.get('/api/faculty-availability/:id', async (req, res) => {
    try {
        const availability = await FacultyAvailability.findById(req.params.id);

        if (!availability) {
            return res.status(404).json({
                success: false,
                message: 'Faculty availability not found'
            });
        }

        res.status(200).json({
            success: true,
            data: availability
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching faculty availability',
            error: error.message
        });
    }
});

// Update faculty availability
router.put('/api/faculty-availability/:id',
    [
        body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
        body('email').optional().isEmail().withMessage('Valid email is required'),
        body('phone').optional().trim().notEmpty().withMessage('Phone number cannot be empty'),
        body('department').optional().trim().notEmpty().withMessage('Department cannot be empty'),
        body('designation').optional().trim().notEmpty().withMessage('Designation cannot be empty'),
        body('dayOfWeek').optional()
            .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
            .withMessage('Valid day of week is required'),
        body('availableTimeSlots').optional().isArray().withMessage('Time slots must be an array')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            if (req.body.availableTimeSlots && !validateTimeSlots(req.body.availableTimeSlots)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid time slot format'
                });
            }

            const availability = await FacultyAvailability.findById(req.params.id);

            if (!availability) {
                return res.status(404).json({
                    success: false,
                    message: 'Faculty availability not found'
                });
            }

            const updatedAvailability = await FacultyAvailability.findByIdAndUpdate(
                req.params.id,
                { ...req.body, updatedAt: Date.now() },
                { new: true, runValidators: true }
            );

            res.status(200).json({
                success: true,
                message: 'Faculty availability updated successfully',
                data: updatedAvailability
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating faculty availability',
                error: error.message
            });
        }
    }
);

// Delete faculty availability
router.delete('/api/faculty-availability/:id', async (req, res) => {
    try {
        const availability = await FacultyAvailability.findById(req.params.id);

        if (!availability) {
            return res.status(404).json({
                success: false,
                message: 'Faculty availability not found'
            });
        }

        await FacultyAvailability.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Faculty availability deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting faculty availability',
            error: error.message
        });
    }
});

// Get faculty availability by department
router.get('/api/faculty-availability/department/:department', async (req, res) => {
    try {
        const availabilities = await FacultyAvailability.find({
            department: req.params.department
        }).sort({ dayOfWeek: 1 });

        res.status(200).json({
            success: true,
            data: availabilities
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching department availabilities',
            error: error.message
        });
    }
});

// Get faculty availability by email
router.get('/api/faculty-availability/faculty/:email', async (req, res) => {
    try {
        const availabilities = await FacultyAvailability.find({
            email: req.params.email
        }).sort({ dayOfWeek: 1 });

        res.status(200).json({
            success: true,
            data: availabilities
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching faculty availabilities',
            error: error.message
        });
    }
});

export default router;