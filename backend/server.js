const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Middleware imports
const errorHandler = require('./middleware/errorHandler');
const { limiter, apiLimiter } = require('./middleware/rateLimit');
const { applyDnsOverride, isDnsFailure, dnsHint } = require('./utils/dns');

// Must run before mongoose connects: an mongodb+srv:// URI needs SRV lookups.
applyDnsOverride();

// Fail fast instead of silently signing tokens with a public fallback secret.
if (!process.env.JWT_SECRET) {
  console.error('❌ JWT_SECRET is not set. Refusing to start with forgeable tokens.');
  process.exit(1);
}

const app = express();

// Behind Vercel/Heroku the client IP lives in X-Forwarded-For. Without this,
// every request shares the proxy's IP and rate limiting is useless.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ============ MIDDLEWARE ============
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Allow tools without an Origin header (curl, health checks) and any
    // configured frontend origin, including comma-separated preview URLs.
    // Disallowed origins simply get no CORS headers; the browser blocks them.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Apply the global rate limiter
app.use(limiter);

// ============ DATABASE CONNECTION ============
console.log('🔗 Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    if (isDnsFailure(err)) {
      console.error(dnsHint(process.env.MONGODB_URI));
    }
    process.exit(1);
  });

// ============ HEALTH CHECK ============
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============ API ROUTES ============
// Auth endpoints get their own stricter limiter inside routes/auth.js.
app.use('/api/auth', apiLimiter, require('./routes/auth'));
app.use('/api/users', apiLimiter, require('./routes/users'));
app.use('/api/services', apiLimiter, require('./routes/services'));
app.use('/api/bookings', apiLimiter, require('./routes/bookings'));
app.use('/api/stores', apiLimiter, require('./routes/stores'));
app.use('/api/admin', apiLimiter, require('./routes/admin'));

// ============ STATIC FILES (Production) ============
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(staticPath));

  // Serve index.html for client-side routes, but never for unknown API paths.
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

// ============ ERROR HANDLING ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

app.use(errorHandler);

// ============ SERVER START ============
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║  🚀 MallBook Backend Server                        ║
║  ✓ Port: ${PORT}
║  ✓ Environment: ${NODE_ENV}
║  ✓ MongoDB: connecting                            ║
╚════════════════════════════════════════════════════╝
  `);
});

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close();
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});
