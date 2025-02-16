import express from 'express';
import User from '../models/User.models.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import authenticateToken from '../middleware/Auth.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const login = async (req, res) => {
    const { email, password, type, rollNumber } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('Invalid email:', email);
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        if (user.type !== type || user.rollNumber !== rollNumber) {
            return res.status(400).json({ message: 'Invalid type or roll number' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Invalid password for email:', email);
            console.log('Entered password:', password);
            console.log('Stored hashed password:', user.password);
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, type: user.type, rollNumber: user.rollNumber },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('Login successful:', email);
        res.status(200).json({ success: true, token, email: user.email, message: 'Login successful' });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const profile = async (req, res) => {
    try {
      const { email } = req.params; // Get rollno from the request parameters
      if (!email) {
        return res.status(400).json({ error: true, message: 'Roll number is required.' });
      }
  
      // Find the user by rollno and exclude the password field
      const user = await User.findOne({ email }).select('-password').lean();
      if (!user) {
        return res.status(404).json({ error: true, message: 'User not found.' });
      }
  
      // Return the user profile
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ error: true, message: 'Server error, please try again later.' });
    }
  };
  
  const updateProfile = async (req, res) => {
    try {
    
      const { name, email, branch } = req.body;
      const profileImage = req.file;
  
    //   if (!rollno) {
    //     return res.status(400).json({ error: true, message: 'Roll number is required.' });
    //   }
  
      // Find the user by rollno
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: true, message: 'User not found.' });
      }
  
      // Update user fields if provided
      if (name) user.name = name;
      if (email) user.email = email;
      if (branch) user.branch = branch;
  
      // Handle profile image upload to Cloudinary
      if (profileImage) {
        const uploadResponse = await cloudinary.uploader.upload(profileImage.path, {
          folder: 'profile_pictures',
          use_filename: true,
          unique_filename: false,
        });
        user.profile = uploadResponse.secure_url;
      }
  
      // Save the updated user
      await user.save();
  
      // Return success response
      res.status(200).json({ success: true, message: 'Profile updated successfully.', data: user });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: true, message: 'Server error, please try again later.' });
    }
  };
  router.post('/api/login', login); // Login
  router.get('/api/profile/:email', authenticateToken, profile); // Fetch profile
  router.put('/api/profile/:email', authenticateToken, upload.single('profileImage'), updateProfile); // Update profile
  
  export default router;