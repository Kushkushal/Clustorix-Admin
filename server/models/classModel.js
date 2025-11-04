const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  school: { type: mongoose.Schema.ObjectId, ref: 'School', required: true },
  class_text: { type: String, required: true },
  class_num: { type: String, required: true },
  asignSubTeach: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Class', ClassSchema);
