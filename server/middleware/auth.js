const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check cookie first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } 
  // Alternatively, check Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle default admin (no DB lookup needed)
    if (decoded.id === 'default-admin-id') {
      req.user = {
        _id: 'default-admin-id',
        id: 'default-admin-id',
        name: 'Super Admin',
        email: process.env.DEFAULT_ADMIN_EMAIL,
        role: 'SuperAdmin',
      };
      return next();
    }
    
    // For regular users, fetch from DB
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
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
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};

module.exports = { protect, authorize };