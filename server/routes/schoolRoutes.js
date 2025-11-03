const express = require('express');
const { getSchools, getSchool, createSchool, updateSchool, deleteSchool, getDashboardSummary } = require('../controllers/schoolController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Dashboard Summary
router.route('/dashboard/summary').get(protect, authorize('SuperAdmin', 'Admin'), getDashboardSummary);

// School CRUD
router.route('/')
    .get(protect, authorize('SuperAdmin', 'Admin'), getSchools)
    .post(protect, authorize('SuperAdmin'), createSchool); // Manual creation for testing

router.route('/:id')
    .get(protect, authorize('SuperAdmin', 'Admin'), getSchool)
    .put(protect, authorize('SuperAdmin'), updateSchool) // Used for approval/toggling isActive
    .delete(protect, authorize('SuperAdmin'), deleteSchool);

module.exports = router;
