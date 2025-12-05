require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const config = require('./config');
const spinRouter = require('./routes/spin');
const usersRouter = require('./routes/users');

// Create app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Port (Render will set process.env.PORT)
const PORT = config.port;

// Show which URI will be used (masked)
const maskedUri = String(config.mongodbUri || '').replace(/:(?:[^:@]+)@/, ':*****@');
console.log('Using MongoDB URI:', maskedUri ? maskedUri : '<<not set>>');

// Centralize DB connection
require('./db');

// ---------- API ROUTES ----------

app.use('/api/spin', spinRouter);
app.use('/api/users', usersRouter);

// Health check for quick probing
app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ---------- STATIC FRONTEND ----------
// Vite build output is in dist/ at the repo root.
// From /server, that path is ../dist
const CLIENT_BUILD_PATH = path.join(__dirname, '..', 'dist');

app.use(express.static(CLIENT_BUILD_PATH));

// SPA fallback: for any non-API route, send index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    // Let API 404s be JSON, not index.html
    return res.status(404).json({ ok: false, error: 'Not found' });
  }

  res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

// ---------- START SERVER ----------

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});