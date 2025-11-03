const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const getSignedJwtToken = (id) => {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
        console.error('❌ JWT_SECRET is not defined in environment variables!');
        throw new Error('JWT_SECRET must be defined in environment variables');
    }
    
    return jwt.sign({ id }, secret, {
        expiresIn: '30d',
    });
};

// Helper function to send token in cookie
const sendTokenResponse = (user, statusCode, res) => {
    const token = getSignedJwtToken(user._id);

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // Changed from 'strict' to 'lax' for cross-origin with credentials
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
};

// @desc    Register a user (Only SuperAdmin can create new Admins)
// @route   POST /api/v1/auth/register
// @access  Private (SuperAdmin only)
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'Admin',
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        // Check if credentials match default admin credentials in env
        const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;

        if (email === defaultEmail && password === defaultPassword) {
            // Create a fake user object for default admin (no DB query needed)
            const user = {
                _id: 'default-admin-id',
                name: 'Super Admin',
                email: defaultEmail,
                role: 'SuperAdmin',
            };

            // Issue token and respond
            sendTokenResponse(user, 200, res);
            return;
        }

        // Otherwise, normal MongoDB user lookup
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = (req, res, next) => {
    // Clear the cookie properly
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 1 * 1000), // Expire immediately
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
        data: {},
    });
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    const user = req.user; // User is attached by the protect middleware
    res.status(200).json({
        success: true,
        data: user,
    });
};

// @desc    Initialize SuperAdmin if none exists
// @route   GET /api/v1/auth/init
// @access  Public (Internal use)
exports.initializeAdmin = async (req, res, next) => {
    try {
        const superAdminExists = await User.findOne({ role: 'SuperAdmin' });

        if (superAdminExists) {
            return res.status(200).json({ success: true, message: 'SuperAdmin already initialized.' });
        }

        const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;

        if (!defaultEmail || !defaultPassword) {
            return res.status(500).json({ success: false, message: 'Default admin credentials not set in environment variables.' });
        }

        const superAdmin = await User.create({
            name: 'Super Admin',
            email: defaultEmail,
            password: defaultPassword,
            role: 'SuperAdmin',
        });

        res.status(201).json({
            success: true,
            message: 'SuperAdmin initialized successfully.',
            user: {
                email: superAdmin.email,
                role: superAdmin.role,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    register: exports.register,
    login: exports.login,
    logout: exports.logout,
    getMe: exports.getMe,
    initializeAdmin: exports.initializeAdmin
};