const express = require('express');
const { 
    getTickets, 
    getTicket, 
    updateTicketStatus,
    getTicketStats,
    getTicketsBySchool  // Add this import
} = require('../controllers/ticketController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// IMPORTANT: Stats route must come BEFORE /:id route
router.route('/stats')
    .get(protect, authorize('SuperAdmin', 'Admin'), getTicketStats);

// Add this new route for school-specific tickets
router.route('/school/:schoolId')
    .get(protect, authorize('SuperAdmin', 'Admin'), getTicketsBySchool);

router.route('/')
    .get(protect, authorize('SuperAdmin', 'Admin'), getTickets);

router.route('/:id')
    .get(protect, authorize('SuperAdmin', 'Admin'), getTicket);

router.route('/:id/status')
    .put(protect, authorize('SuperAdmin', 'Admin'), updateTicketStatus);

module.exports = router;