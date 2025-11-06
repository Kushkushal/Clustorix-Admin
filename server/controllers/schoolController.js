const School = require('../models/School');

// @desc    Get all schools
// @route   GET /api/v1/schools
// @access  Private (Admin/SuperAdmin)
exports.getSchools = async (req, res, next) => {
    try {
        const schools = await School.find();
        res.status(200).json({ success: true, count: schools.length, data: schools });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single school
// @route   GET /api/v1/schools/:id
// @access  Private (Admin/SuperAdmin)
exports.getSchool = async (req, res, next) => {
    try {
        const school = await School.findById(req.params.id);

        if (!school) {
            return res.status(404).json({ success: false, message: `School not found with id of ${req.params.id}` });
        }

        res.status(200).json({ success: true, data: school });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new school
// @route   POST /api/v1/schools
// @access  Private (SuperAdmin)
exports.createSchool = async (req, res, next) => {
    try {
        const school = await School.create(req.body);
        res.status(201).json({ success: true, data: school });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update school
// @route   PUT /api/v1/schools/:id
// @access  Private (SuperAdmin)
exports.updateSchool = async (req, res, next) => {
    try {
        const school = await School.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!school) {
            return res.status(404).json({ success: false, message: `School not found with id of ${req.params.id}` });
        }

        res.status(200).json({ success: true, data: school });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update school features
// @route   PUT /api/v1/schools/:id/features
// @access  Private (SuperAdmin)
exports.updateSchoolFeatures = async (req, res, next) => {
    try {
        const { features } = req.body;

        const school = await School.findByIdAndUpdate(
            req.params.id,
            { features },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!school) {
            return res.status(404).json({ success: false, message: `School not found with id of ${req.params.id}` });
        }

        res.status(200).json({ success: true, data: school });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Delete school
// @route   DELETE /api/v1/schools/:id
// @access  Private (SuperAdmin)
exports.deleteSchool = async (req, res, next) => {
    try {
        const school = await School.findByIdAndDelete(req.params.id);

        if (!school) {
            return res.status(404).json({ success: false, message: `School not found with id of ${req.params.id}` });
        }

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get dashboard summary data
// @route   GET /api/v1/dashboard/summary
// @access  Private (Admin/SuperAdmin)
exports.getDashboardSummary = async (req, res, next) => {
    try {
        const totalSchools = await School.countDocuments();
        const activeSchools = await School.countDocuments({ isActive: true });
        const pendingSchools = await School.countDocuments({ isActive: false });

        res.status(200).json({
            success: true,
            data: {
                totalSchools,
                activeSchools,
                pendingSchools,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};