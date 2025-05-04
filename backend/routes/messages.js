const express = require('express');
const Message = require('../models/Message');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all messages for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find({ recipient: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Get unread message count
router.get('/unread', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({ 
      recipient: req.user._id,
      read: false
    });
    
    res.json({ count });
  } catch (error) {
    console.error('Get unread message count error:', error);
    res.status(500).json({ message: 'Failed to fetch unread count' });
  }
});

// Mark messages as read
router.post('/mark-read', auth, async (req, res) => {
  try {
    const { messageIds } = req.body;
    
    if (!messageIds || !Array.isArray(messageIds)) {
      return res.status(400).json({ message: 'Message IDs are required' });
    }
    
    await Message.updateMany(
      { 
        _id: { $in: messageIds },
        recipient: req.user._id // Ensure user can only update their own messages
      },
      { read: true }
    );
    
    res.json({ success: true });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({ message: 'Failed to mark messages as read' });
  }
});

// Delete a message
router.delete('/:messageId', auth, async (req, res) => {
  try {
    const messageId = req.params.messageId;
    const message = await Message.findOne({ 
      _id: messageId,
      recipient: req.user._id
    });

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await Message.findByIdAndDelete(messageId);
    return res.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Failed to delete message' });
  }
});

// Send a message to a user
router.post('/', async (req, res) => {
  try {
    const { username, content } = req.body;

    if (!username || !content) {
      return res.status(400).json({ message: 'Username and message content are required' });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: 'Message is too long (max 500 characters)' });
    }

    // Find recipient by username
    const recipient = await User.findOne({ username });
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Create and save message
    const message = new Message({
      recipient: recipient._id,
      content,
      read: false // Messages are unread by default
    });

    await message.save();
    
    // Update user's lastSeen to show they have activity
    await User.findByIdAndUpdate(recipient._id, { lastSeen: new Date() });

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router; 