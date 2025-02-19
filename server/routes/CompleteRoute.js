// complaints.routes.js
import express from 'express';
import Complents from '../models/Complents.model.js';

const router = express.Router();

// POST route to submit a new complaint
router.post('/api/complaints', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                message: 'All fields are required: name, email, subject, message' 
            });
        }
        
        const newComplaint = new Complents({
            name,
            email,
            subject,
            message,
            status: 'unread'
        });
        
        await newComplaint.save();
        
        res.status(201).json({
            message: 'Complaint submitted successfully',
            data: newComplaint
        });
    } catch (error) {
        console.error('Error submitting complaint:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET route to retrieve all complaints
router.get('/api/complaints', async (req, res) => {
    try {
        const complaints = await Complents.find().sort({ createdAt: -1 });
        res.status(200).json({
            message: 'Complaints retrieved successfully',
            data: complaints
        });
    } catch (error) {
        console.error('Error retrieving complaints:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// PATCH route to update complaint status
router.patch('/api/complaints/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ 
                message: 'Invalid status. Must be either "approved" or "rejected"' 
            });
        }

        const updatedComplaint = await Complents.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedComplaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.status(200).json({
            message: 'Complaint status updated successfully',
            data: updatedComplaint
        });
    } catch (error) {
        console.error('Error updating complaint status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;