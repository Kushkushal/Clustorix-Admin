const Student = require('../models/Student');

// @desc    Get all students
// @route   GET /api/v1/students
// @access  Private (Admin/SuperAdmin)
exports.getStudents = async (req, res, next) => {
    try {
        const students = await Student.find()
            .populate('school', 'name');
        
        res.status(200).json({ 
            success: true, 
            count: students.length, 
            data: students 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single student
// @route   GET /api/v1/students/:id
// @access  Private (Admin/SuperAdmin)
exports.getStudent = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate('school', 'name');

        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: `Student not found with id of ${req.params.id}` 
            });
        }

        res.status(200).json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get students by school
// @route   GET /api/v1/students/school/:schoolId
// @access  Private (Admin/SuperAdmin)
exports.getStudentsBySchool = async (req, res, next) => {
    try {
        const students = await Student.find({ school: req.params.schoolId });

        res.status(200).json({ 
            success: true, 
            count: students.length, 
            data: students 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get students by class - REMOVE THIS FUNCTION OR COMMENT OUT
// exports.getStudentsByClass = async (req, res, next) => { ... };

// @desc    Create new student
// @route   POST /api/v1/students
// @access  Private (Admin/SuperAdmin)
exports.createStudent = async (req, res, next) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json({ success: true, data: student });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update student
// @route   PUT /api/v1/students/:id
// @access  Private (Admin/SuperAdmin)
exports.updateStudent = async (req, res, next) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: `Student not found with id of ${req.params.id}` 
            });
        }

        res.status(200).json({ success: true, data: student });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete student
// @route   DELETE /api/v1/students/:id
// @access  Private (SuperAdmin)
exports.deleteStudent = async (req, res, next) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ 
                success: false, 
                message: `Student not found with id of ${req.params.id}` 
            });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get student statistics
// @route   GET /api/v1/students/stats/summary
// @access  Private (Admin/SuperAdmin)
exports.getStudentStats = async (req, res, next) => {
    try {
        const totalStudents = await Student.countDocuments();
        const maleStudents = await Student.countDocuments({ gender: 'male' });
        const femaleStudents = await Student.countDocuments({ gender: 'female' });

        // Students by school
        const studentsBySchool = await Student.aggregate([
            {
                $group: {
                    _id: '$school',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'schools',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'schoolInfo'
                }
            },
            {
                $unwind: '$schoolInfo'
            },
            {
                $project: {
                    schoolName: '$schoolInfo.name',
                    count: 1
                }
            }
        ]);

        // REMOVED studentsByClass aggregation

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalStudents,
                    maleStudents,
                    femaleStudents,
                },
                studentsBySchool
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};