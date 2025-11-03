const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Priority 1: Check Authorization header (for localStorage-based auth)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('🔐 Token from Authorization header');
  }
  // Priority 2: Check cookies (fallback)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('🔐 Token from cookie');
  }

  // Debug logging
  console.log('=== Auth Middleware Debug ===');
  console.log('Has Authorization header:', !!req.headers.authorization);
  console.log('Has cookie:', !!req.cookies?.token);
  console.log('Token found:', !!token);
  console.log('Origin:', req.headers.origin);
  console.log('============================');

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized - No token provided' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded, user ID:', decoded.id);
    
    // Handle default admin (from env)
    if (decoded.id === 'default-admin-id') {
      req.user = {
        _id: 'default-admin-id',
        id: 'default-admin-id',
        name: 'Super Admin',
        email: process.env.DEFAULT_ADMIN_EMAIL,
        role: 'SuperAdmin',
      };
      console.log('✅ Default admin authenticated');
      return next();
    }
    
    // Handle database users
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    req.user = user;
    console.log('✅ User authenticated:', user.email);
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized - Invalid or expired token'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }
    
    console.log('✅ User authorized with role:', req.user.role);
    next();
  };
};

module.exports = { protect, authorize };