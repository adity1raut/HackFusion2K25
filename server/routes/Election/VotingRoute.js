import express from 'express';
import ElectionCandidate from '../../models/ElectionCandidate.js';
import User from '../../models/User.models.js';

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

// Route to update the vote count and user's voting status
router.put('/api/election-candidates/vote', async (req, res) => {
    try {
        const { regNo, userId } = req.body; // Need both candidate regNo and userId

        // First check if user exists and hasn't voted
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user has already voted
        if (user.isVoted) {
            return res.status(400).json({ message: 'User has already voted' });
        }

        // Find the candidate
        const candidate = await ElectionCandidate.findOne({ regNo });
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        // Use session to ensure both operations succeed or fail together
        const session = await ElectionCandidate.startSession();
        try {
            session.startTransaction();

            // Increment candidate's vote count
            const updatedCandidate = await ElectionCandidate.findOneAndUpdate(
                { regNo },
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
        res.status(500).json({ 
            message: 'Failed to record vote', 
            error: error.message 
        });
    }
});

// Route to check if a user has voted
router.get('/api/election-candidates/check-vote/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ hasVoted: user.isVoted });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to check voting status', 
            error: error.message 
        });
    }
});

// Route to get voting statistics
router.get('/api/election-candidates/stats', async (req, res) => {
    try {
        const totalVotes = await ElectionCandidate.aggregate([
            {
                $group: {
                    _id: null,
                    totalVotes: { $sum: '$votes' }
                }
            }
        ]);

        const candidatesWithPercentage = await ElectionCandidate.aggregate([
            {
                $project: {
                    name: 1,
                    regNo: 1,
                    votes: 1,
                    percentage: {
                        $multiply: [
                            { $divide: ['$votes', totalVotes[0].totalVotes] },
                            100
                        ]
                    }
                }
            }
        ]);

        res.status(200).json({
            totalVotes: totalVotes[0].totalVotes,
            candidates: candidatesWithPercentage
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Failed to fetch voting statistics', 
            error: error.message 
        });
    }
});

router.get('/api/user-stats', async (req, res) => {
    try {
      // Fetch total number of users
      const totalUsers = await User.countDocuments({});
  
      // Fetch number of users who have voted
      const votedUsers = await User.countDocuments({ isvoted: true });
  
      // Fetch all users and sort them by 'isvoted' status
      const sortedUsers = await User.find().sort({ isvoted: -1 }); // Sort by isvoted in descending order
  
      res.json({
        totalUsers,
        votedUsers,
        sortedUsers, // Include sorted user data in the response
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Error fetching user statistics" });
    }
  });
  
export default router;