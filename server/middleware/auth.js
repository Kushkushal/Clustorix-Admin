const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  let token;

  // Priority 1: Check Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('🔐 Token from Authorization header');
  }
  // Priority 2: Check cookies
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('🔐 Token from cookie');
  }

  if (!token) {
    console.log('❌ No token provided');
    return res.status(401).json({ 
      success: false, 
      message: 'Not authorized - No token provided' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decoded, user ID:', decoded.id);
    
    // Only handle default admin (no database lookup needed)
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
    
    // If token has different ID, it's invalid
    console.log('❌ Invalid user ID in token:', decoded.id);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token - User not authorized' 
    });
    
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    
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