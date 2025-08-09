const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// POST /auth/reset-admin — create or update the administrator user
router.post('/reset-admin', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password required' });
    }

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

// GET /auth/health — simple health check
router.get('/health', (_req, res) => {
  res.json({ success: true, status: 'Backend is running' });
});

// POST /auth/login — verify credentials
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    res.json({ success: true, username: user.username });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});
// DEBUG: list available auth routes
router.get('/routes', (req, res) => {
  const routes = [];
  router.stack.forEach((layer) => {
    if (layer.route) {
      const path = layer.route.path;
      const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
      routes.push({ methods, path: `/auth${path}` });
    }
  });
  res.json(routes);
});

module.exports = router;

