const express = require('express');
const { register, login, logout, getMe, initializeAdmin } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/init', initializeAdmin);

// Public routes
router.post('/login', login);
router.get('/logout', logout); // ← REMOVE protect middleware

// Private routes
router.get('/me', protect, getMe);
router.post('/register', protect, authorize('SuperAdmin'), register);

module.exports = router;