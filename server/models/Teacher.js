const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const TeacherSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.ObjectId,
        ref: 'School',
        required: [true, 'Please add a school']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    qualification: {
        type: String,
        required: [true, 'Please add qualification']
    },
    date_of_birth: {
        type: Date,
        required: [true, 'Please add date of birth']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: [true, 'Please add gender']
    },
    phone_number: {
        type: String,
        required: [true, 'Please add phone number'],
        match: [
            /^[0-9]{10}$/,
            'Please add a valid 10-digit phone number'
        ]
    },
    teacher_image: {
        type: String,
        default: 'https://res.cloudinary.com/default/image/upload/default-teacher.jpg'
    },
    joining_date: {
        type: Date,
        required: [true, 'Please add joining date'],
        default: Date.now
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt before saving
TeacherSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match teacher entered password to hashed password in database
TeacherSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Teacher', TeacherSchema);