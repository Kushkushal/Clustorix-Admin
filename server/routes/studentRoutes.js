const express = require('express');
const {
    getStudents,
    getStudent,
    getStudentsBySchool,
    // getStudentsByClass, // REMOVE THIS
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentStats
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Student Statistics
router.route('/stats/summary')
    .get(protect, authorize('SuperAdmin', 'Admin'), getStudentStats);

// Students by School
router.route('/school/:schoolId')
    .get(protect, authorize('SuperAdmin', 'Admin'), getStudentsBySchool);

// REMOVED Students by Class route

// Student CRUD
router.route('/')
    .get(protect, authorize('SuperAdmin', 'Admin'), getStudents)
    .post(protect, authorize('SuperAdmin', 'Admin'), createStudent);

router.route('/:id')
    .get(protect, authorize('SuperAdmin', 'Admin'), getStudent)
    .put(protect, authorize('SuperAdmin', 'Admin'), updateStudent)
    .delete(protect, authorize('SuperAdmin'), deleteStudent);

module.exports = router;