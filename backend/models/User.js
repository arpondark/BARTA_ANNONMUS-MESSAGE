const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  profilePicture: {
    type: String,
    default: '' // URL to profile picture
  },
  bio: {
    type: String,
    default: '',
    maxlength: 160
  },
  preferredCardTemplate: {
    type: String,
    default: 'default'
  },
  allowNotifications: {
    type: Boolean,
    default: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema); 