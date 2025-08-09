const router = require('express').Router();
const User = require('../models/User');

// Reset or create admin user
router.post('/reset-admin', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ success: false, message: 'Password required' });

    let user = await User.findOne({ username: 'administrator' });
    if (!user) {
      user = new User({ username: 'administrator', password });
    } else {
      user.password = password;
    }
    await user.save();
    res.json({ success: true, message: 'Admin password reset successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
