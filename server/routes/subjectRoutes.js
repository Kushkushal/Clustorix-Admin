const express = require('express');
const { getSubjects, getSubject, getSubjectsBySchool, createSubject, updateSubject, deleteSubject } = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Subjects by School
router.route('/school/:schoolId').get(protect, authorize('SuperAdmin', 'Admin'), getSubjectsBySchool);

// CRUD routes
router.route('/')
  .get(protect, authorize('SuperAdmin', 'Admin'), getSubjects)
  .post(protect, authorize('SuperAdmin', 'Admin'), createSubject);

router.route('/:id')
  .get(protect, authorize('SuperAdmin', 'Admin'), getSubject)
  .put(protect, authorize('SuperAdmin', 'Admin'), updateSubject)
  .delete(protect, authorize('SuperAdmin'), deleteSubject);

module.exports = router;
