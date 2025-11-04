const Attendance = require('../models/attendanceModel');

// GET all attendances
exports.getAttendances = async (req, res) => {
  try {
    const attendances = await Attendance.find().populate('school', 'name').populate('student', 'name').populate('class', 'class_num');
    res.status(200).json({ success: true, count: attendances.length, data: attendances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single attendance
exports.getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id).populate('school', 'name').populate('student', 'name').populate('class', 'class_num');
    if (!attendance) {
      return res.status(404).json({ success: false, message: `Attendance not found with id ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET attendances by school
exports.getAttendancesBySchool = async (req, res) => {
  try {
    const attendances = await Attendance.find({ school: req.params.schoolId }).populate('student').populate('class');
    res.status(200).json({ success: true, count: attendances.length, data: attendances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE new attendance
exports.createAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.create(req.body);
    res.status(201).json({ success: true, data: attendance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE attendance
exports.updateAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!attendance) {
      return res.status(404).json({ success: false, message: `Attendance not found with id ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);
    if (!attendance) {
      return res.status(404).json({ success: false, message: `Attendance not found with id ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
