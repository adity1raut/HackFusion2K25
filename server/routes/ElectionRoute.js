import express from "express";
import transporter from '../config/NodeMailer.js';

const router = express.Router();
const otps = {};

// Route to send OTP
router.post('/api/send-otp', (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
  
    otps[email] = otp; // Store OTP temporarily
  
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
        } else {
            res.send('OTP sent');
        }
    });
});
  
// Route to verify OTP
router.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
  
    if (otps[email] === otp) {
        delete otps[email]; // Remove OTP after verification
        res.send('OTP verified');
    } else {
        res.status(400).send('Invalid OTP');
    }
});

export default router;
