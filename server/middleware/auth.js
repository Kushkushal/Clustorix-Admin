const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Not authorized, no token' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Special handling for default admin (not in database)
        if (decoded.id === 'default-admin-id') {
            req.user = {
                _id: 'default-admin-id',
                name: 'Super Admin',
                email: process.env.DEFAULT_ADMIN_EMAIL,
                role: decoded.role || 'SuperAdmin'
            };
            return next();
        }

        // Regular user from database
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Not authorized, user not found' 
            });
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(401).json({ 
            success: false, 
            message: 'Not authorized, token failed' 
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
                message: `User role ${req.user.role} is not authorized to access this route`,
            });
        }
        next();
    };
};

module.exports = { protect, authorize };