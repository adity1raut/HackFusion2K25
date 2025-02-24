import express from 'express';
import ElectionCandidate from '../../models/ElectionCandidate.js';
import User from '../../models/User.models.js';

const router = express.Router();

// Route to fetch all election candidates
router.get('/api/election-candidates', async (req, res) => {
    try {
        const candidates = await ElectionCandidate.find({}).sort({ position: 1, name: 1 });
        res.status(200).json(candidates);
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({ 
            message: 'Failed to fetch candidates', 
            error: error.message 
        });
    }
});

// Route to update the vote count and user's voting status
router.put('/api/election-candidates/vote', async (req, res) => {
    try {
        const { regNo, userId, position } = req.body;

        // Validate input
        if (!regNo || !userId || !position) {
            return res.status(400).json({ 
                message: 'Registration number, user ID, and position are required' 
            });
        }

        // Find the user and candidate
        const [user, candidate] = await Promise.all([
            User.findById(userId),
            ElectionCandidate.findOne({ regNo, position }) // Added position to query
        ]);

        // Validate user and candidate existence
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found for this position' });
        }

        // Check if user has already voted
        if (user.isVoted) {
            return res.status(400).json({ message: 'User has already voted' });
        }

        // Use session for transaction
        const session = await ElectionCandidate.startSession();
        try {
            session.startTransaction();

            // Update candidate votes
            const updatedCandidate = await ElectionCandidate.findOneAndUpdate(
                { regNo, position },
                { $inc: { votes: 1 } },
                { new: true, session }
            );

            // Update user's voting status
            await User.findByIdAndUpdate(
                userId,
                { isVoted: true },
                { session }
            );

            await session.commitTransaction();
            
            res.status(200).json({
                message: 'Vote recorded successfully',
                candidate: updatedCandidate
            });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('Error recording vote:', error);
        res.status(500).json({ 
            message: 'Failed to record vote', 
            error: error.message 
        });
    }
});

// Route to check if a user has voted
router.get('/api/election-candidates/check-vote/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ 
            hasVoted: user.isVoted,
            userId: user._id 
        });
    } catch (error) {
        console.error('Error checking vote status:', error);
        res.status(500).json({ 
            message: 'Failed to check voting status', 
            error: error.message 
        });
    }
});

// Route to get voting statistics by position
router.get('/api/election-candidates/stats', async (req, res) => {
    try {
        const stats = await ElectionCandidate.aggregate([
            {
                $group: {
                    _id: '$position',
                    totalVotes: { $sum: '$votes' },
                    candidates: {
                        $push: {
                            name: '$name',
                            regNo: '$regNo',
                            votes: '$votes',
                            position: '$position'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    position: '$_id',
                    totalVotes: 1,
                    candidates: {
                        $map: {
                            input: '$candidates',
                            as: 'candidate',
                            in: {
                                name: '$$candidate.name',
                                regNo: '$$candidate.regNo',
                                votes: '$$candidate.votes',
                                percentage: {
                                    $multiply: [
                                        { $divide: ['$$candidate.votes', { $max: ['$totalVotes', 1] }] },
                                        100
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]);

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching voting statistics:', error);
        res.status(500).json({ 
            message: 'Failed to fetch voting statistics', 
            error: error.message 
        });
    }
});

export default router;