require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const config = require('./config');
const spinRouter = require('./routes/spin');
const usersRouter = require('./routes/users');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = config.port;

// log masked Mongo URI
const maskedUri = String(config.mongodbUri || '').replace(/:(?:[^:@]+)@/, ':*****@');
console.log('Using MongoDB URI:', maskedUri ? maskedUri : '<<not set>>');

// connect DB
require('./db');

// ---------- API ROUTES ----------
app.use('/api/spin', spinRouter);
app.use('/api/users', usersRouter);

// health check
app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ---------- STATIC FRONTEND ----------
const CLIENT_BUILD_PATH = path.join(__dirname, '..', 'dist', 'app');

app.use(express.static(CLIENT_BUILD_PATH));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ ok: false, error: 'Not found' });
  }
  res.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

// ---------- START SERVER ----------
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
