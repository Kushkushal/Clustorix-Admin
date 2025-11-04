const express = require('express');
const { getClasses, getClass, getClassesBySchool, createClass, updateClass, deleteClass } = require('../controllers/classController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Classes by School
router.route('/school/:schoolId').get(protect, authorize('SuperAdmin', 'Admin'), getClassesBySchool);

// CRUD routes
router.route('/')
  .get(protect, authorize('SuperAdmin', 'Admin'), getClasses)
  .post(protect, authorize('SuperAdmin', 'Admin'), createClass);

router.route('/:id')
  .get(protect, authorize('SuperAdmin', 'Admin'), getClass)
  .put(protect, authorize('SuperAdmin', 'Admin'), updateClass)
  .delete(protect, authorize('SuperAdmin'), deleteClass);

module.exports = router;
