const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const upload = require('../utils/fileUpload');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Get current user profile
router.get('/', auth, async (req, res) => {
  try {
    // Exclude sensitive information when sending back to client
    const user = {
      id: req.user._id,
      username: req.user.username,
      profilePicture: req.user.profilePicture,
      bio: req.user.bio,
      allowNotifications: req.user.allowNotifications,
      createdAt: req.user.createdAt
    };
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

// Update profile
router.put('/', auth, async (req, res) => {
  try {
    const { bio, allowNotifications } = req.body;
    const updates = {};
    
    if (bio !== undefined) updates.bio = bio;
    if (allowNotifications !== undefined) updates.allowNotifications = allowNotifications;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      updates, 
      { new: true }
    );
    
    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      profilePicture: updatedUser.profilePicture,
      bio: updatedUser.bio,
      allowNotifications: updatedUser.allowNotifications
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Upload profile picture
router.post('/upload-photo', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    // If user already has a profile picture, delete the old one
    if (req.user.profilePicture) {
      const oldPicPath = path.join(__dirname, '..', req.user.profilePicture.replace(/^\//, ''));
      if (fs.existsSync(oldPicPath)) {
        fs.unlinkSync(oldPicPath);
      }
    }
    
    // Create URL path to the uploaded file
    const profilePicturePath = `/uploads/${req.file.filename}`;
    
    // Update user's profile with new picture
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id, 
      { profilePicture: profilePicturePath }, 
      { new: true }
    );
    
    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      profilePicture: updatedUser.profilePicture
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ message: 'Failed to upload profile picture' });
  }
});

module.exports = router; 