const express = require('express');
const { register, login, logout, getMe, initializeAdmin } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes (no authentication required)
router.post('/login', login);           // Anyone can login
router.get('/logout', logout);          // Anyone can logout (no need for auth)
router.get('/init', initializeAdmin);   // Initialize default admin (one-time setup)

// Protected routes (authentication required)
router.get('/me', protect, getMe);      // Get current user info (must be logged in)

// SuperAdmin only routes
router.post('/register', protect, authorize('SuperAdmin'), register);  // Only SuperAdmin can create new admins

module.exports = router;