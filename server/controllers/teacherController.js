const Teacher = require('../models/Teacher');

// @desc    Get all teachers
// @route   GET /api/v1/teachers
// @access  Private (Admin/SuperAdmin)
exports.getTeachers = async (req, res, next) => {
    try {
        const teachers = await Teacher.find()
            .populate('school', 'name');
        
        res.status(200).json({ 
            success: true, 
            count: teachers.length, 
            data: teachers 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single teacher
// @route   GET /api/v1/teachers/:id
// @access  Private (Admin/SuperAdmin)
exports.getTeacher = async (req, res, next) => {
    try {
        const teacher = await Teacher.findById(req.params.id)
            .populate('school', 'name');

        if (!teacher) {
            return res.status(404).json({ 
                success: false, 
                message: `Teacher not found with id of ${req.params.id}` 
            });
        }

        res.status(200).json({ success: true, data: teacher });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get teachers by school
// @route   GET /api/v1/teachers/school/:schoolId
// @access  Private (Admin/SuperAdmin)
exports.getTeachersBySchool = async (req, res, next) => {
    try {
        const teachers = await Teacher.find({ school: req.params.schoolId });

        res.status(200).json({ 
            success: true, 
            count: teachers.length, 
            data: teachers 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new teacher
// @route   POST /api/v1/teachers
// @access  Private (Admin/SuperAdmin)
exports.createTeacher = async (req, res, next) => {
    try {
        const teacher = await Teacher.create(req.body);
        res.status(201).json({ success: true, data: teacher });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update teacher
// @route   PUT /api/v1/teachers/:id
// @access  Private (Admin/SuperAdmin)
exports.updateTeacher = async (req, res, next) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!teacher) {
            return res.status(404).json({ 
                success: false, 
                message: `Teacher not found with id of ${req.params.id}` 
            });
        }

        res.status(200).json({ success: true, data: teacher });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete teacher
// @route   DELETE /api/v1/teachers/:id
// @access  Private (SuperAdmin)
exports.deleteTeacher = async (req, res, next) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);

        if (!teacher) {
            return res.status(404).json({ 
                success: false, 
                message: `Teacher not found with id of ${req.params.id}` 
            });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get teacher statistics
// @route   GET /api/v1/teachers/stats/summary
// @access  Private (Admin/SuperAdmin)
exports.getTeacherStats = async (req, res, next) => {
    try {
        const totalTeachers = await Teacher.countDocuments();
        const maleTeachers = await Teacher.countDocuments({ gender: 'male' });
        const femaleTeachers = await Teacher.countDocuments({ gender: 'female' });

        // Teachers by school
        const teachersBySchool = await Teacher.aggregate([
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

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalTeachers,
                    maleTeachers,
                    femaleTeachers,
                },
                teachersBySchool
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};