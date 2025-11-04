const express = require('express');
const {
    getTeachers,
    getTeacher,
    getTeachersBySchool,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacherStats
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Teacher Statistics
router.route('/stats/summary')
    .get(protect, authorize('SuperAdmin', 'Admin'), getTeacherStats);

// Teachers by School
router.route('/school/:schoolId')
    .get(protect, authorize('SuperAdmin', 'Admin'), getTeachersBySchool);

// Teacher CRUD
router.route('/')
    .get(protect, authorize('SuperAdmin', 'Admin'), getTeachers)
    .post(protect, authorize('SuperAdmin', 'Admin'), createTeacher);

router.route('/:id')
    .get(protect, authorize('SuperAdmin', 'Admin'), getTeacher)
    .put(protect, authorize('SuperAdmin', 'Admin'), updateTeacher)
    .delete(protect, authorize('SuperAdmin'), deleteTeacher);

module.exports = router;