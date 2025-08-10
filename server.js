import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Core middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// --- API ROUTES ---
app.get('/health', (req, res) => res.json({ ok: true }));

// Example auth route (replace with real logic)
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === 'administrator' && password === 'NewSecurePass123') {
    return res.json({ success: true, token: 'fake-jwt-token' });
  }
  return res.status(401).json({ success: false, error: 'Invalid credentials' });
});

// --- STATIC FRONTEND (built Vue in /dist) ---
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// --- START SERVER ---
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(API listening on ));
