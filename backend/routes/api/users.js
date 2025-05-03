// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { bio, preferredCardTemplate } = req.body;
    const userId = req.user.id;

    const updateData = {};
    if (bio !== undefined) updateData.bio = bio;
    if (preferredCardTemplate !== undefined) updateData.preferredCardTemplate = preferredCardTemplate;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        username: user.username,
        bio: user.bio,
        profilePicture: user.profilePicture,
        preferredCardTemplate: user.preferredCardTemplate
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile by username (public)
router.get('/profile/:username', async (req, res) => {
  try {
    const username = req.params.username;
    
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return limited public information
    res.json({
      username: user.username,
      bio: user.bio,
      profilePicture: user.profilePicture,
      preferredCardTemplate: user.preferredCardTemplate
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
}); 