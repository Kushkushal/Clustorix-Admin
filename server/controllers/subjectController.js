const Subject = require('../models/subjectModel');

// GET all subjects
exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate('school', 'name');
    res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single subject
exports.getSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate('school', 'name');
    if (!subject) {
      return res.status(404).json({ success: false, message: `Subject not found with id ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET subjects by school
exports.getSubjectsBySchool = async (req, res) => {
  try {
    const subjects = await Subject.find({ school: req.params.schoolId });
    res.status(200).json({ success: true, count: subjects.length, data: subjects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE new subject
exports.createSubject = async (req, res) => {
  try {
    const subject = await Subject.create(req.body);
    res.status(201).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE subject
exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subject) {
      return res.status(404).json({ success: false, message: `Subject not found with id ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: subject });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE subject
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) {
      return res.status(404).json({ success: false, message: `Subject not found with id ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
