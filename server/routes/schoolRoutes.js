const express = require('express');
const { 
    getSchools, 
    getSchool, 
    createSchool, 
    updateSchool, 
    updateSchoolFeatures,
    deleteSchool, 
    getDashboardSummary 
} = require('../controllers/schoolController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Dashboard Summary
router.route('/dashboard/summary').get(protect, authorize('SuperAdmin', 'Admin'), getDashboardSummary);

// School CRUD
router.route('/')
    .get(protect, authorize('SuperAdmin', 'Admin'), getSchools)
    .post(protect, authorize('SuperAdmin'), createSchool);

router.route('/:id')
    .get(protect, authorize('SuperAdmin', 'Admin'), getSchool)
    .put(protect, authorize('SuperAdmin'), updateSchool)
    .delete(protect, authorize('SuperAdmin'), deleteSchool);

// Update school features
router.route('/:id/features')
    .put(protect, authorize('SuperAdmin'), updateSchoolFeatures);

module.exports = router;