const mongoose = require('mongoose');

const SchoolSchema = new mongoose.Schema({
    school_name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    owner_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: false, // Schools need admin approval
    },
    registrationDate: {
        type: Date,
        default: Date.now,
    },
    subscriptionStatus: {
        type: String,
        enum: ['Pending', 'Active', 'Expired', 'Trial'],
        default: 'Trial',
    },
    // Mock data for dashboard
    totalStudents: {
        type: Number,
        default: 0,
    },
    totalTeachers: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('School', SchoolSchema);
