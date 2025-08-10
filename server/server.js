// server/server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const apiRoutes  = require('./routes/api');

const app = express();

// ----- CONFIG -----
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'https://oracle-front-end-production.up.railway.app';
const MONGODB_URI     = process.env.MONGODB_URI;
const PORT            = process.env.PORT || 5000;

// Trust Railway proxy so Secure cookies work
app.set('trust proxy', 1);

// Body + cookies
app.use(express.json());
app.use(cookieParser());

// CORS (must be exact origin; allow credentials)
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Helmet (relax CORP so cross-origin assets aren’t blocked)
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Routes
app.use('/auth', authRoutes);
app.use('/api',  apiRoutes);

// Health
app.get('/health', (_req, res) => res.json({ ok: true }));

// DB
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI env var');
  process.exit(1);
}
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => { console.error('❌ MongoDB connection error:', err); process.exit(1); });

// Start
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
