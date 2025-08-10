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
const MONGODB_URI     = process.env.MONGODB_URI; // may be undefined in prod until you set it
const PORT            = process.env.PORT || 5000;

// Trust Railway proxy so Secure cookies work
app.set('trust proxy', 1);

// Body + cookies
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Helmet
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Basic root + health
app.get('/', (_req, res) => res.status(200).send('API online'));
app.get('/health', (_req, res) => {
  const ready = mongoose.connection.readyState === 1; // 1 = connected
  res.status(200).json({ ok: true, db: ready });
});

// Routes (these can 500 if DB truly required; that’s fine)
app.use('/auth', authRoutes);
app.use('/api',  apiRoutes);

// ---- Start server first ----
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// ---- Connect DB without crashing the process ----
if (!MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI not set. API will run without DB.');
} else {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      // don't exit; keep serving / and /health so Railway stops 502s
    });
}
