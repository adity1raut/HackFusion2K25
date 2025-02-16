import express from 'express';
import { body, validationResult } from 'express-validator';
import Doctor from '../models/Doctor.model.js';

const router = express.Router();

// Create a new doctor appointment
router.post(
    '/api/doctors',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('phone').trim().notEmpty().withMessage('Phone number is required'),
        body('illness').trim().notEmpty().withMessage('Illness description is required'),
        body('time').trim().notEmpty().withMessage('Appointment time is required'),
        body('date').isISO8601().toDate().withMessage('Valid date is required'),
    ],
    async (req, res) => {
        try {
            // Validation check
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ 
                    success: false,
                    errors: errors.array() 
                });
            }

            const appointment = new Doctor({
                ...req.body,
                owner_id: req.user._id // Assuming user is authenticated
            });

            await appointment.save();

            res.status(201).json({
                success: true,
                message: 'Appointment created successfully',
                data: appointment
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating appointment',
                error: error.message
            });
        }
    }
);

// Get all doctor appointments
router.get('/api/doctors', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const appointments = await Doctor.find()
            .populate('owner_id', 'name email')
            .sort({ date: 1, time: 1 })
            .skip(skip)
            .limit(limit);

        const total = await Doctor.countDocuments();

        res.status(200).json({
            success: true,
            data: appointments,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalAppointments: total,
                appointmentsPerPage: limit
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments',
            error: error.message
        });
    }
});

// Get a single doctor appointment
router.get('/api/doctors/:id', async (req, res) => {
    try {
        const appointment = await Doctor.findById(req.params.id)
            .populate('owner_id', 'name email');

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        res.status(200).json({
            success: true,
            data: appointment
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching appointment',
            error: error.message
        });
    }
});

// Update a doctor appointment
router.put('/api/doctors/:id', 
    [
        body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
        body('email').optional().isEmail().withMessage('Valid email is required'),
        body('phone').optional().trim().notEmpty().withMessage('Phone number cannot be empty'),
        body('illness').optional().trim().notEmpty().withMessage('Illness description cannot be empty'),
        body('time').optional().trim().notEmpty().withMessage('Appointment time cannot be empty'),
        body('date').optional().isISO8601().toDate().withMessage('Valid date is required'),
    ],
    async (req, res) => {
        try {
            // Validation check
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    errors: errors.array()
                });
            }

            const appointment = await Doctor.findById(req.params.id);

            if (!appointment) {
                return res.status(404).json({
                    success: false,
                    message: 'Appointment not found'
                });
            }

            // Optional: Check if user owns this appointment
            if (appointment.owner_id.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized to update this appointment'
                });
            }

            const updatedAppointment = await Doctor.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            res.status(200).json({
                success: true,
                message: 'Appointment updated successfully',
                data: updatedAppointment
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating appointment',
                error: error.message
            });
        }
    }
);

// Delete a doctor appointment
router.delete('/api/doctors/:id', async (req, res) => {
    try {
        const appointment = await Doctor.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Optional: Check if user owns this appointment
        if (appointment.owner_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this appointment'
            });
        }

        await Doctor.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting appointment',
            error: error.message
        });
    }
});

// Get appointments by date range
router.get('/api/doctors/range/:startDate/:endDate', async (req, res) => {
    try {
        const { startDate, endDate } = req.params;

        const appointments = await Doctor.find({
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).sort({ date: 1, time: 1 });

        res.status(200).json({
            success: true,
            data: appointments
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching appointments by date range',
            error: error.message
        });
    }
});

export default router;