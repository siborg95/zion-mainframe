const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));

// Login route — matches frontend (expects data.ok)
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === 'administrator' && password === 'NewSecurePass123') {
    return res.json({ ok: true, token: 'fake-jwt-token' });
  }
  return res.status(401).json({ ok: false, error: 'invalid_credentials' });
});

// Health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// Serve Vue build (if you’re hosting the SPA from this service)
// NOTE: dist is usually at repo root, while server.js is in /server
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => console.log(`API listening on ${PORT}`));
