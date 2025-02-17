import express from 'express';
import Complents from '../models/Complents.model.js'; // Ensure the correct file extension

const router = express.Router();

// POST route to submit a new complaint
router.post('/api/complaints', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'All fields are required: name, email, subject, message' });
        }

        // Create a new complaint
        const newComplaint = new Complents({
            name,
            email,
            subject,
            message,
            status: 'unread' // Default status
        });

        // Save the complaint to the database
        await newComplaint.save();

        // Respond with the created complaint
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
        // Retrieve all complaints from the database
        const complaints = await Complents.find();

        // Convert the complaints to a map with id as the key
        const complaintsMap = new Map(complaints.map(complaint => [complaint._id, complaint]));

        // Respond with the complaints data
        res.status(200).json({
            message: 'Complaints retrieved successfully',
            data: Array.from(complaintsMap.values())
        });
    } catch (error) {
        console.error('Error retrieving complaints:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
