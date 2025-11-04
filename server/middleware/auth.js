const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Priority 1: Check Authorization header (for localStorage-based auth)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('🔐 Token from Authorization header');
  }
  // Priority 2: Check cookies (fallback for cookie-based auth)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('🔐 Token from cookie');
  }

  // No token found
  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized - No token provided' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded, user ID:', decoded.id);
    
    // Handle default admin (from env variables)
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
      console.log('❌ User not found in database for ID:', decoded.id);
      return res.status(401).json({ 
        success: false, 
        message: 'User not found - Token may be invalid' 
      });
    }
    
    req.user = user;
    console.log('✅ User authenticated:', user.email, '| Role:', user.role);
    next();
    
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    
    // Provide specific error messages
    let message = 'Not authorized - Invalid token';
    
    if (err.name === 'JsonWebTokenError') {
      message = 'Not authorized - Malformed token';
    } else if (err.name === 'TokenExpiredError') {
      message = 'Not authorized - Token expired';
    }
    
    return res.status(401).json({ 
      success: false, 
      message 
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log('❌ Authorization failed - No user in request');
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log(`❌ Authorization failed - User role '${req.user.role}' not in [${roles.join(', ')}]`);
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route. Required: ${roles.join(' or ')}`,
      });
    }
    
    console.log('✅ User authorized with role:', req.user.role);
    next();
  };
};

module.exports = { protect, authorize };