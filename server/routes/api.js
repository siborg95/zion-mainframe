// server/routes/api.js
const router = require('express').Router();

// Simple health probe for Railway
router.get('/health', (req, res) => res.json({ ok: true, scope: 'api' }));

module.exports = router;
