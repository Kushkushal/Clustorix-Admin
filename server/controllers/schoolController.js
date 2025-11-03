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

// @desc    Create new school (Mock registration)
// @route   POST /api/v1/schools
// @access  Private (SuperAdmin) - For testing/manual entry
exports.createSchool = async (req, res, next) => {
    try {
        const school = await School.create(req.body);
        res.status(201).json({ success: true, data: school });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Update school (e.g., approve, toggle isActive)
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

        // Mock data for other metrics
        const totalStudents = 15000; // Mock
        const activeSubscriptions = 45; // Mock
        const pendingTickets = 12; // Mock

        // Mock chart data (Monthly new schools)
        const monthlyData = [
            { month: 'Jan', schools: 5 },
            { month: 'Feb', schools: 8 },
            { month: 'Mar', schools: 12 },
            { month: 'Apr', schools: 15 },
            { month: 'May', schools: 10 },
            { month: 'Jun', schools: 20 },
        ];

        res.status(200).json({
            success: true,
            data: {
                widgets: {
                    totalSchools,
                    activeSchools,
                    pendingSchools,
                    totalStudents,
                    activeSubscriptions,
                    pendingTickets,
                },
                charts: {
                    monthlyNewSchools: monthlyData,
                },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
