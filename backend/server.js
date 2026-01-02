const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Middleware imports
const errorHandler = require('./middleware/errorHandler');
const { limiter, authLimiter, apiLimiter } = require('./middleware/rateLimit');

const app = express();

// ============ MIDDLEWARE ============
// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting
app.use(limiter);

// ============ DATABASE CONNECTION ============
console.log('🔗 Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected successfully');
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
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
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/users', apiLimiter, require('./routes/users'));
app.use('/api/services', apiLimiter, require('./routes/services'));
app.use('/api/bookings', apiLimiter, require('./routes/bookings'));
app.use('/api/stores', apiLimiter, require('./routes/stores'));
app.use('/api/admin', apiLimiter, require('./routes/admin'));

// ============ STATIC FILES (Production) ============
if (process.env.NODE_ENV === 'production') {
  // Serve static files from frontend build
  const staticPath = path.join(__dirname, '../frontend/build');
  app.use(express.static(staticPath));
  
  // Serve index.html for all routes not caught by API
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
  });
}

// ============ ERROR HANDLING ============
// 404 handler - must be before global error handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler - must be last
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
║  ✓ MongoDB: Connected                             ║
║  ✓ All Middleware: Active                         ║
╚════════════════════════════════════════════════════╝
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close();
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
}); 