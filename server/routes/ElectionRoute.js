import express from 'express';
import transporter from '../config/NodeMailer.js';
import User from '../models/User.models.js'; // Assuming you have a User model

const router = express.Router();
const OTP_EXPIRATION_TIME = 60 * 1000; // 1 minute in milliseconds

// Use a Map to store OTPs
const otpStore = new Map();

// Route to send OTP
router.post('/api/election/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if email exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP

        // Store OTP with expiration time in the Map
        otpStore.set(email, {
            otp,
            createdAt: Date.now(),
        });

        // Set a timeout to delete the OTP after 1 minute
        setTimeout(() => {
            otpStore.delete(email);
        }, OTP_EXPIRATION_TIME);

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Your OTP Code',
            text: `Welcome to the Election 2k25 of SGGS Nanded! \n\nYour election OTP code is: ${otp}\nThis OTP is valid for only one minute.`,
        };

        // Send OTP email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({ message: 'Error sending email' });
            }
            res.json({ message: 'OTP sent' });
        });
    } catch (error) {
        console.error('Error checking user email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to verify OTP
router.post('/api/election/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        // Check if email exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }

        // Check if OTP exists and is still valid
        const otpData = otpStore.get(email);
        if (otpData && otpData.otp === otp) {
            // Check if OTP is expired
            if (Date.now() - otpData.createdAt < OTP_EXPIRATION_TIME) {
                otpStore.delete(email); // Remove OTP after verification
                res.json({ message: 'OTP verified' });
            } else {
                otpStore.delete(email); // Remove expired OTP
                res.status(400).json({ message: 'OTP expired' });
            }
        } else {
            res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to verify roll number
router.post('/api/election/verify-rollno', async (req, res) => {
    const { rollno } = req.body;

    try {
        // Check if roll number exists in the database
        const user = await User
            .findOne({ rollno })
            .select('name email rollno'); // Select only necessary fields

        if (!user) {
            return res.status(400).json({ message: 'Roll number not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error verifying roll number:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
