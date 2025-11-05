const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
    },
    issueArea: {
        type: String,
        required: [true, 'Please specify issue area'],
        enum: ['student', 'teacher', 'admin'],
    },
    ticketImages: [{
        type: String,
    }],
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved'],
        default: 'pending',
    }
}, { 
    timestamps: true 
});

// REMOVED the pre-hook - we'll populate manually in controller

module.exports = mongoose.model('Ticket', TicketSchema);