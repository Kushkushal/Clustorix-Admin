const mongoose = require('mongoose');

const InstallmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  feesPaid: { type: Number, default: 0 },
  feesLeft: { type: Number, required: true },
  totalFees: { type: Number, required: true },
  lastDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'paid', 'late'], default: 'pending' }
}, { _id: false });

const FeesSchema = new mongoose.Schema({
  school: { type: mongoose.Schema.ObjectId, ref: 'School', required: true },
  student: { type: mongoose.Schema.ObjectId, ref: 'Student', required: true },
  studentName: { type: String, required: true },
  class: { type: mongoose.Schema.ObjectId, ref: 'Class', required: true },
  className: { type: String, required: true },
  installments: [InstallmentSchema],
  paymentHistory: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Fees', FeesSchema);
