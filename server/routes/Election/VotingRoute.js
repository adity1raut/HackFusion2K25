import express from 'express';
import ElectionCandidate from '../../models/ElectionCandidate.js';

const router = express.Router();

// Route to fetch all election candidates
router.get('/api/election-candidates', async (req, res) => {
    try {
        const candidates = await ElectionCandidate.find({});
        res.status(200).json(candidates);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch candidates', error });
    }
});

// Route to update the vote count for a candidate by registration number
router.put('/api/election-candidates/vote', async (req, res) => {
    try {
        const { regNo } = req.body; // Extract the registration number from the request body
        const candidate = await ElectionCandidate.findOne({ regNo });
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        candidate.votes += 1; // Directly increment the votes

        await candidate.save();
        res.status(200).json(candidate);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update vote count', error });
    }
});

export default router;
