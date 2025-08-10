import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Example login route
app.post('/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'administrator' && password === 'NewSecurePass123') {
    return res.json({ success: true, token: 'fake-jwt-token' });
  }
  res.status(401).json({ success: false });
});

// Serve Vue build
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API listening on ${PORT}`));
