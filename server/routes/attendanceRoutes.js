const express = require('express');
const { getAttendances, getAttendance, getAttendancesBySchool, createAttendance, updateAttendance, deleteAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Attendances by School
router.route('/school/:schoolId').get(protect, authorize('SuperAdmin', 'Admin'), getAttendancesBySchool);

// CRUD routes
router.route('/')
  .get(protect, authorize('SuperAdmin', 'Admin'), getAttendances)
  .post(protect, authorize('SuperAdmin', 'Admin'), createAttendance);

router.route('/:id')
  .get(protect, authorize('SuperAdmin', 'Admin'), getAttendance)
  .put(protect, authorize('SuperAdmin', 'Admin'), updateAttendance)
  .delete(protect, authorize('SuperAdmin'), deleteAttendance);

module.exports = router;
