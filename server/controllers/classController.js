const Class = require('../models/classModel');

// GET all classes
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('school', 'name');
    res.status(200).json({ success: true, count: classes.length, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single class
exports.getClass = async (req, res) => {
  try {
    const classObj = await Class.findById(req.params.id).populate('school', 'name');
    if (!classObj) {
      return res.status(404).json({ success: false, message: `Class not found with id ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: classObj });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET classes by school
exports.getClassesBySchool = async (req, res) => {
  try {
    const classes = await Class.find({ school: req.params.schoolId });
    res.status(200).json({ success: true, count: classes.length, data: classes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE new class
exports.createClass = async (req, res) => {
  try {
    const classObj = await Class.create(req.body);
    res.status(201).json({ success: true, data: classObj });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE class
exports.updateClass = async (req, res) => {
  try {
    const classObj = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!classObj) {
      return res.status(404).json({ success: false, message: `Class not found with id ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: classObj });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE class
exports.deleteClass = async (req, res) => {
  try {
    const classObj = await Class.findByIdAndDelete(req.params.id);
    if (!classObj) {
      return res.status(404).json({ success: false, message: `Class not found with id ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
