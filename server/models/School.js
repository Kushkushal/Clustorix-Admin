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
    password: {
        type: String,
        required: true,
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
    school_image: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    features: {
        dashboard: {
            type: Boolean,
            default: true,
        },
        class: {
            type: Boolean,
            default: true,
        },
        subject: {
            type: Boolean,
            default: true,
        },
        students: {
            type: Boolean,
            default: true,
        },
        teachers: {
            type: Boolean,
            default: true,
        },
        periods: {
            type: Boolean,
            default: true,
        },
        attendance: {
            type: Boolean,
            default: true,
        },
        schoolmarks: {
            type: Boolean,
            default: false,
        },
        examinations: {
            type: Boolean,
            default: true,
        },
        events: {
            type: Boolean,
            default: false,
        },
        bus: {
            type: Boolean,
            default: true,
        },
        fees: {
            type: Boolean,
            default: true,
        },
        promotion: {
            type: Boolean,
            default: false,
        },
        notice: {
            type: Boolean,
            default: true,
        },
        ticket: {
            type: Boolean,
            default: false,
        },
        assignments: {
            type: Boolean,
            default: false,
        },
        chat: {
            type: Boolean,
            default: false,
        },
    },
    subscriptionStatus: {
        type: String,
        enum: ['Pending', 'Active', 'Expired', 'Trial'],
        default: 'Trial',
    },
}, { timestamps: true });

module.exports = mongoose.model('School', SchoolSchema);