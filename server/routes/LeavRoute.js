import express from 'express';
import { body, validationResult } from 'express-validator';
import LeaveApplication from '../models/Leav.models.js'; // Ensure the file extension is correct

const router = express.Router();

// Create a leave application
router.post(
    '/api/leave-applications',
    [
        body('student_information.roll_no').notEmpty().withMessage('Roll number is required'),
        body('student_information.student_name').notEmpty().withMessage('Student name is required'),
        body('student_information.student_email').isEmail().withMessage('Invalid student email'),
        body('parent_information.parent_name').notEmpty().withMessage('Parent name is required'),
        body('parent_information.parent_email').isEmail().withMessage('Invalid parent email'),
        body('leave_details.reason_for_leave').notEmpty().withMessage('Reason for leave is required'),
        body('leave_details.leave_start_date').isDate().withMessage('Invalid start date'),
        body('leave_details.leave_end_date').isDate().withMessage('Invalid end date'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
        }

        try {
            const leaveApplication = new LeaveApplication(req.body);
            await leaveApplication.save();
            res.status(201).json({ message: 'Leave application created successfully', data: leaveApplication });
        } catch (error) {
            res.status(400).json({ message: 'Error creating leave application', error: error.message });
        }
    }
);

// Fetch all leave applications with pagination
router.get('/api/leave-applications', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const leaveApplications = await LeaveApplication.find()
            .populate('student_information.roll_no', 'name email')
            .skip(skip)
            .limit(limit);

        const total = await LeaveApplication.countDocuments();

        res.status(200).json({
            data: leaveApplications,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leave applications', error: error.message });
    }
});

// Fetch a single leave application by ID
router.get('/api/leave-applications/:id', async (req, res) => {
    try {
        const leaveApplication = await LeaveApplication.findById(req.params.id).populate('student_information.roll_no', 'name email');
        if (!leaveApplication) {
            return res.status(404).json({ message: 'Leave application not found' });
        }
        res.status(200).json({ data: leaveApplication });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leave application', error: error.message });
    }
});

// Update a leave application by ID
router.put('/api/leave-applications/:id', async (req, res) => {
    try {
        const leaveApplication = await LeaveApplication.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!leaveApplication) {
            return res.status(404).json({ message: 'Leave application not found' });
        }
        res.status(200).json({ message: 'Leave application updated successfully', data: leaveApplication });
    } catch (error) {
        res.status(400).json({ message: 'Error updating leave application', error: error.message });
    }
});

// Delete a leave application by ID
router.delete('/api/leave-applications/:id', async (req, res) => {
    try {
        const leaveApplication = await LeaveApplication.findByIdAndDelete(req.params.id);
        if (!leaveApplication) {
            return res.status(404).json({ message: 'Leave application not found' });
        }
        res.status(200).json({ message: 'Leave application deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting leave application', error: error.message });
    }
});

// Error-handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

export default router;