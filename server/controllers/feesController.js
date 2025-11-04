const Fees = require('../models/feesModel');

// GET all fees records
exports.getFees = async (req, res) => {
  try {
    const fees = await Fees.find().populate('school', 'name').populate('student', 'name').populate('class', 'class_num');
    res.status(200).json({ success: true, count: fees.length, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET single fee record
exports.getFee = async (req, res) => {
  try {
    const fee = await Fees.findById(req.params.id).populate('school', 'name').populate('student', 'name').populate('class', 'class_num');
    if (!fee) {
      return res.status(404).json({ success: false, message: `Fee not found with id ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: fee });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET fees by school
exports.getFeesBySchool = async (req, res) => {
  try {
    const fees = await Fees.find({ school: req.params.schoolId }).populate('student').populate('class');
    res.status(200).json({ success: true, count: fees.length, data: fees });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE new fees record
exports.createFee = async (req, res) => {
  try {
    const fee = await Fees.create(req.body);
    res.status(201).json({ success: true, data: fee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// UPDATE fee record
exports.updateFee = async (req, res) => {
  try {
    const fee = await Fees.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!fee) {
      return res.status(404).json({ success: false, message: `Fee not found with id ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: fee });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE fee record
exports.deleteFee = async (req, res) => {
  try {
    const fee = await Fees.findByIdAndDelete(req.params.id);
    if (!fee) {
      return res.status(404).json({ success: false, message: `Fee not found with id ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET fee statistics/summary
exports.getFeeStats = async (req, res) => {
  try {
    const totalFeesCount = await Fees.countDocuments();
    const totalPaidInstallments = await Fees.aggregate([
      { $unwind: "$installments" },
      { $match: { "installments.status": "paid" } },
      { $count: "count" }
    ]);
    const totalPendingInstallments = await Fees.aggregate([
      { $unwind: "$installments" },
      { $match: { "installments.status": "pending" } },
      { $count: "count" }
    ]);
    res.status(200).json({
      success: true,
      data: {
        totalFeesCount,
        totalPaidInstallments: totalPaidInstallments[0]?.count || 0,
        totalPendingInstallments: totalPendingInstallments[0]?.count || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// In feesController.js

// @desc    Get fees statistics including total fees amount
// @route   GET /api/v1/fees/stats/summary
// @access  Private (Admin/SuperAdmin)
exports.getFeesStats = async (req, res) => {
  try {
    const stats = await Fees.aggregate([
      { $unwind: "$installments" },
      {
        $group: {
          _id: null,
          totalFeesAmount: { $sum: "$installments.totalFees" },  // Remove $toDouble
          totalFeesPaid: { $sum: "$installments.feesPaid" },
          totalFeesLeft: { $sum: "$installments.feesLeft" },
          totalFeeRecords: { $sum: 1 }
        }
      }
    ]);

    const result = stats[0] || {
      totalFeesAmount: 0,
      totalFeesPaid: 0,
      totalFeesLeft: 0,
      totalFeeRecords: 0
    };

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in getFeesStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


