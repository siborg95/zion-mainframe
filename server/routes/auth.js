// server/routes/auth.js
const router = require('express').Router();

// Simple health probe for Railway
router.get('/health', (req, res) => res.json({ ok: true, scope: 'auth' }));

module.exports = router;
