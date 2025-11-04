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

// Helper function to send token in cookie and response
const sendTokenResponse = (user, statusCode, res) => {
    const token = getSignedJwtToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
    };

    res.status(statusCode)
       .cookie('token', token, cookieOptions)
       .json({
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

// @desc    Login user (ONLY checks environment variables - NO DATABASE)
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Please provide an email and password' 
            });
        }

        console.log('🔐 Login attempt for:', email);

        // Get credentials from environment
        const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL;
        const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;

        // Check if env variables are set
        if (!defaultEmail || !defaultPassword) {
            console.error('❌ DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD not set in .env');
            return res.status(500).json({ 
                success: false, 
                message: 'Server configuration error' 
            });
        }

        // ONLY check environment credentials - NO DATABASE
        if (email === defaultEmail && password === defaultPassword) {
            console.log('✅ Login successful for:', email);
            
            const user = {
                _id: 'default-admin-id',
                name: 'Super Admin',
                email: defaultEmail,
                role: 'SuperAdmin',
            };

            sendTokenResponse(user, 200, res);
        } else {
            console.log('❌ Invalid credentials for:', email);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

    } catch (error) {
        console.error('❌ Login error:', error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during login' 
        });
    }
};

// @desc    Log user out
// @route   GET /api/v1/auth/logout
// @access  Public
exports.logout = (req, res, next) => {
    console.log('🚪 Logout request received');
    
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
        data: {},
    });
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id || user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('❌ getMe error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data'
        });
    }
};

// @desc    Register - DISABLED (not using database)
// @route   POST /api/v1/auth/register
// @access  Private
exports.register = async (req, res, next) => {
    return res.status(501).json({
        success: false,
        message: 'User registration is disabled. Only default admin can login.'
    });
};

// @desc    Initialize - DISABLED (not using database)
// @route   GET /api/v1/auth/init
// @access  Public
exports.initializeAdmin = async (req, res, next) => {
    return res.status(200).json({
        success: true,
        message: 'Using environment-based authentication. No database initialization needed.',
        admin: {
            email: process.env.DEFAULT_ADMIN_EMAIL,
            note: 'Login with credentials from .env file'
        }
    });
};

module.exports = {
    register: exports.register,
    login: exports.login,
    logout: exports.logout,
    getMe: exports.getMe,
    initializeAdmin: exports.initializeAdmin
};