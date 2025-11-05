const Ticket = require('../models/Ticket');

exports.getTickets = async (req, res, next) => {
  try {
    const { status, issueArea, search } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }
    if (issueArea) {
      query.issueArea = issueArea;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Select only needed fields, exclude 'priority', 'resolvedAt', 'resolvedBy'
    const tickets = await Ticket.find(query)
      .populate({
        path: 'school',
        select: 'school_name  owner_name  email phone city state'
      })
      .sort({ createdAt: -1 })
      .select('_id school title description issueArea ticketImages status createdAt updatedAt')  // specify fields
      .lean();

    return res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTicket = async (req, res, next) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate({
                path: 'school',
                select: 'school_name owner_name email phone city state'
            });

        if (!ticket) {
            return res.status(404).json({ 
                success: false, 
                message: `Ticket not found with id of ${req.params.id}` 
            });
        }

        res.status(200).json({ 
            success: true, 
            data: ticket 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

exports.updateTicketStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;
    const updateData = { status };

    // Optionally include adminNotes if provided
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }



    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate({
        path: 'school',
        select: 'school_name owner_name  email phone city state'
      })
      .select('_id school title description issueArea ticketImages status createdAt updatedAt');

    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: `Ticket not found with id of ${req.params.id}`
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedTicket
    });
  } catch (error) {
    console.error('Update status error:', error);
    return res.status(400).json({ success: false, message: error.message });
  }
};


exports.getTicketStats = async (req, res, next) => {
    try {
        const totalTickets = await Ticket.countDocuments();
        const pendingTickets = await Ticket.countDocuments({ status: 'pending' });
        const inProgressTickets = await Ticket.countDocuments({ status: 'in-progress' });
        const resolvedTickets = await Ticket.countDocuments({ status: 'resolved' });
        const closedTickets = await Ticket.countDocuments({ status: 'closed' });
        
        const ticketsByArea = await Ticket.aggregate([
            {
                $group: {
                    _id: '$issueArea',
                    count: { $sum: 1 }
                }
            }
        ]);
        
        const ticketsByPriority = await Ticket.aggregate([
            {
                $group: {
                    _id: '$priority',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalTickets,
                pendingTickets,
                inProgressTickets,
                resolvedTickets,
                closedTickets,
                ticketsByArea,
                ticketsByPriority
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// @desc    Get tickets for a specific school
// @route   GET /api/v1/tickets/school/:schoolId
// @access  Private (Admin/SuperAdmin)
exports.getTicketsBySchool = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ school: req.params.schoolId })
      .populate({
        path: 'school',
        select: 'school_name owner_name email phone city state'
      })
      .sort({ createdAt: -1 })
      .select('_id school title description issueArea ticketImages status createdAt updatedAt')
      .lean();

    return res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    console.error('Error fetching school tickets:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};