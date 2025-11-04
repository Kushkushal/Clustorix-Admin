const express = require('express');
const { getFees, getFee, getFeesBySchool, createFee, updateFee, deleteFee, getFeeStats,getFeesStats  } = require('../controllers/feesController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Statistics
// router.route('/stats/summary').get(protect, authorize('SuperAdmin', 'Admin'), getFeeStats);

// Fees by School
router.route('/school/:schoolId').get(protect, authorize('SuperAdmin', 'Admin'), getFeesBySchool);

// CRUD routes
router.route('/')
  .get(protect, authorize('SuperAdmin', 'Admin'), getFees)
  .post(protect, authorize('SuperAdmin', 'Admin'), createFee);

router.route('/:id')
  .get(protect, authorize('SuperAdmin', 'Admin'), getFee)
  .put(protect, authorize('SuperAdmin', 'Admin'), updateFee)
  .delete(protect, authorize('SuperAdmin'), deleteFee);


router.route('/stats/summary').get(protect, authorize('SuperAdmin', 'Admin'), getFeesStats);
module.exports = router;
