const jwt = require('jsonwebtoken');
const User = require('../models/User');

const NO_TOKEN = 'No token, authorization denied';
const INVALID_TOKEN = 'Token is not valid';

const unauthorized = (message = INVALID_TOKEN) => {
  const error = new Error(message);
  error.status = 401;
  return error;
};

// Verify the bearer token and load the user from MongoDB.
// The token only proves identity; the database is the authority for the role.
const authenticate = async (req) => {
  const token = req.header('Authorization')?.replace(/^Bearer\s+/i, '');

  if (!token) throw unauthorized(NO_TOKEN);

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw unauthorized(INVALID_TOKEN);
  }

  const user = await User.findById(decoded.userId).select('-password');
  if (!user) throw unauthorized(INVALID_TOKEN);

  return user;
};

const sendAuthError = (res, error) => {
  if (!error.status) console.error('Authentication error:', error.message);
  return res.status(error.status || 500).json({
    success: false,
    message: error.status ? error.message : 'Server error during authentication'
  });
};

const auth = async (req, res, next) => {
  try {
    req.user = await authenticate(req);
    next();
  } catch (error) {
    return sendAuthError(res, error);
  }
};

// Factory so a route can require any combination of roles without
// re-implementing the verify + load + check sequence.
const requireRoles = (...roles) => async (req, res, next) => {
  try {
    req.user = await authenticate(req);

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires role: ${roles.join(' or ')}`
      });
    }

    next();
  } catch (error) {
    return sendAuthError(res, error);
  }
};

const adminAuth = requireRoles('admin');
const storeManagerAuth = requireRoles('admin', 'store_manager');

module.exports = { auth, adminAuth, storeManagerAuth, authenticate };
