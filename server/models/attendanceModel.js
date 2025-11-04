const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  school: { type: mongoose.Schema.ObjectId, ref: 'School', required: true },
  student: { type: mongoose.Schema.ObjectId, ref: 'Student', required: true },
  teacher: { type: mongoose.Schema.ObjectId, ref: 'Teacher', required: true },
  class: { type: mongoose.Schema.ObjectId, ref: 'Class', required: true },
  subject: { type: mongoose.Schema.ObjectId, ref: 'Subject', required: true },
  period: { type: mongoose.Schema.ObjectId, ref: 'Period' },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
