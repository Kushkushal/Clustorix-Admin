import { useState } from 'react';
import { Search, Filter, Plus, Clock, CheckCircle, AlertCircle, XCircle, MessageSquare, User, Calendar } from 'lucide-react';

const Ticket = () => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Sample tickets data
  const tickets = [
    {
      id: 'TKT-001',
      title: 'Unable to access robotics module',
      description: 'Students are getting error when trying to open the robotics module. Please help urgently.',
      school: 'Delhi Public School',
      submittedBy: 'Rajesh Kumar',
      email: 'rajesh.k@dps.edu',
      priority: 'high',
      status: 'open',
      category: 'Technical',
      createdAt: '2024-11-01T10:30:00',
      updatedAt: '2024-11-01T10:30:00',
      replies: 0
    },
    {
      id: 'TKT-002',
      title: 'Request for additional training session',
      description: 'We would like to schedule an extra training session for new teachers.',
      school: 'Ryan International School',
      submittedBy: 'Priya Sharma',
      email: 'priya.s@ryan.edu',
      priority: 'medium',
      status: 'in-progress',
      category: 'Training',
      createdAt: '2024-10-30T14:20:00',
      updatedAt: '2024-11-02T09:15:00',
      replies: 3
    },
    {
      id: 'TKT-003',
      title: 'Subscription renewal inquiry',
      description: 'Please provide details about the renewal process and available discounts.',
      school: 'Modern School',
      submittedBy: 'Amit Patel',
      email: 'amit.p@modern.edu',
      priority: 'low',
      status: 'resolved',
      category: 'Billing',
      createdAt: '2024-10-28T11:00:00',
      updatedAt: '2024-10-29T16:45:00',
      replies: 5
    },
    {
      id: 'TKT-004',
      title: 'Equipment not working properly',
      description: 'The Arduino kits provided are not functioning. Need replacement urgently.',
      school: 'St. Mary\'s School',
      submittedBy: 'Sarah Johnson',
      email: 'sarah.j@stmarys.edu',
      priority: 'high',
      status: 'open',
      category: 'Equipment',
      createdAt: '2024-11-03T08:45:00',
      updatedAt: '2024-11-03T08:45:00',
      replies: 1
    },
    {
      id: 'TKT-005',
      title: 'Password reset request',
      description: 'Multiple teachers unable to login. Need to reset passwords.',
      school: 'Cambridge School',
      submittedBy: 'Michael Chen',
      email: 'michael.c@cambridge.edu',
      priority: 'medium',
      status: 'in-progress',
      category: 'Account',
      createdAt: '2024-11-02T13:30:00',
      updatedAt: '2024-11-03T10:00:00',
      replies: 2
    },
    {
      id: 'TKT-006',
      title: 'Workshop rescheduling',
      description: 'Need to reschedule the upcoming workshop due to exam schedule conflict.',
      school: 'Delhi Public School',
      submittedBy: 'Neha Verma',
      email: 'neha.v@dps.edu',
      priority: 'low',
      status: 'closed',
      category: 'Training',
      createdAt: '2024-10-25T09:00:00',
      updatedAt: '2024-10-26T17:00:00',
      replies: 4
    },
  ];

  const getPriorityConfig = (priority) => {
    const configs = {
      high: { color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500', label: 'High' },
      medium: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', dot: 'bg-yellow-500', label: 'Medium' },
      low: { color: 'bg-green-100 text-green-700 border-green-200', dot: 'bg-green-500', label: 'Low' }
    };
    return configs[priority] || configs.medium;
  };

  const getStatusConfig = (status) => {
    const configs = {
      open: { color: 'bg-blue-100 text-blue-700', icon: AlertCircle, label: 'Open' },
      'in-progress': { color: 'bg-purple-100 text-purple-700', icon: Clock, label: 'In Progress' },
      resolved: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Resolved' },
      closed: { color: 'bg-gray-100 text-gray-700', icon: XCircle, label: 'Closed' }
    };
    return configs[status] || configs.open;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Technical': '🔧',
      'Training': '📚',
      'Billing': '💳',
      'Equipment': '🔌',
      'Account': '👤',
    };
    return icons[category] || '📋';
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === 'all' || ticket.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    avgResponseTime: '2.5 hrs'
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60); // minutes
    
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Support Tickets</h1>
        <p className="text-gray-600">Manage and resolve customer support requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">OPEN</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.open}</p>
          <p className="text-sm text-gray-600 mt-1">Pending tickets</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">IN PROGRESS</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.inProgress}</p>
          <p className="text-sm text-gray-600 mt-1">Being handled</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">RESOLVED</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.resolved}</p>
          <p className="text-sm text-gray-600 mt-1">Successfully closed</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-xs font-medium text-gray-500">AVG RESPONSE</span>
          </div>
          <p className="text-3xl font-bold text-gray-800">{stats.avgResponseTime}</p>
          <p className="text-sm text-gray-600 mt-1">Response time</p>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'open', 'in-progress', 'resolved', 'closed'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab === 'in-progress' ? 'In Progress' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition">
              <Plus className="w-4 h-4" />
              New Ticket
            </button>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTickets.map((ticket) => {
          const priorityConfig = getPriorityConfig(ticket.priority);
          const statusConfig = getStatusConfig(ticket.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getCategoryIcon(ticket.category)}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${priorityConfig.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dot}`}></span>
                        {priorityConfig.label}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-800 text-base">{ticket.title}</h3>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ticket.description}</p>

              {/* Metadata */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{ticket.submittedBy}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{ticket.school}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{ticket.replies}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Category Badge */}
              <div className="mt-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                  {ticket.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTickets.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl">
          <div className="text-6xl mb-4">🎫</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No tickets found</h3>
          <p className="text-gray-600">Try adjusting your filters or search criteria</p>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getCategoryIcon(selectedTicket.category)}</span>
                    <span className="text-sm font-mono text-gray-500">{selectedTicket.id}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedTicket.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="flex gap-2 mb-4">
                {(() => {
                  const statusConfig = getStatusConfig(selectedTicket.status);
                  const priorityConfig = getPriorityConfig(selectedTicket.priority);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${priorityConfig.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${priorityConfig.dot}`}></span>
                        {priorityConfig.label} Priority
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                        {selectedTicket.category}
                      </span>
                    </>
                  );
                })()}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700">{selectedTicket.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">School</p>
                  <p className="font-medium text-gray-800">{selectedTicket.school}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Submitted By</p>
                  <p className="font-medium text-gray-800">{selectedTicket.submittedBy}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-gray-800">{selectedTicket.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Created</p>
                  <p className="font-medium text-gray-800">{new Date(selectedTicket.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                  Respond
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition">
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ticket;