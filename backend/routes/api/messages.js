// Create a new message
router.post('/', async (req, res) => {
  try {
    const { recipient, content } = req.body;
    
    if (!content || !recipient) {
      return res.status(400).json({ message: 'Recipient and content are required' });
    }
    
    // Find the recipient user
    const recipientUser = await User.findOne({ username: recipient });
    
    if (!recipientUser) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    
    // Create a new message using the recipient's preferred card template
    const newMessage = new Message({
      recipient: recipientUser._id,
      content: content,
      cardTemplate: recipientUser.preferredCardTemplate || 'default'
    });
    
    await newMessage.save();
    
    res.status(201).json({
      message: 'Message sent successfully',
      id: newMessage._id
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark message as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const messageId = req.params.id;
    const userId = req.user.id;
    
    const message = await Message.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Check if user owns this message
    if (message.recipient.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    message.isRead = true;
    await message.save();
    
    res.json({ message: 'Message marked as read' });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({ message: 'Server error' });
  }
}); 