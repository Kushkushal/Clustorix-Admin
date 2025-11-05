import React, { useState, useEffect } from 'react';
import { ImTicket } from "react-icons/im";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { useAuth } from '../context/AuthContext';

const Ticket = () => {
  const { api } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const [filters, setFilters] = useState({
    status: '',
    issueArea: '',
    search: ''
  });

  const [stats, setStats] = useState({
    totalTickets: 0,
    pendingTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    closedTickets: 0
  });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/tickets', {
        params: {
          status: filters.status || undefined,
          issueArea: filters.issueArea || undefined,
          search: filters.search || undefined
        }
      });

      const ticketsData = response.data?.data || [];
      const normalizedTickets = Array.isArray(ticketsData) ? ticketsData.map(ticket => ({
        ...ticket,
        ticketImages: Array.isArray(ticket.ticketImages) ? ticket.ticketImages : []
      })) : [];
      setTickets(normalizedTickets);
    } catch (error) {
      showNotification('Failed to fetch tickets', 'error');
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/v1/tickets/stats');
      if (response.data && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [filters]);

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      setUpdating(true);

      const payload = { status: newStatus };

      console.log('Updating ticket:', ticketId, 'with payload:', payload);

      const response = await api.put(`/v1/tickets/${ticketId}/status`, payload);

      console.log('Update response:', response.data);

      showNotification('Ticket status updated successfully', 'success');
      setShowModal(false);
      setSelectedTicket(null);
      fetchTickets();
      fetchStats();
    } catch (error) {
      console.error('Failed to update ticket:', error);
      console.error('Error response:', error.response?.data);

      const errorMessage = error.response?.data?.message || 'Failed to update ticket status';
      showNotification(errorMessage, 'error');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 -mt-3">
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 sm:px-6 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white animate-fade-in max-w-sm`}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm sm:text-base">{notification.message}</span>
            <button onClick={() => setNotification({ show: false, message: '', type: '' })}>
              <FiX className="text-xl" />
            </button>
          </div>
        </div>
      )}

     
         <div className="flex items-center justify-center space-x-3">
          <ImTicket className="text-2xl text-gray-700" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-0.5">
            Ticket Management
          </h1>
        </div>
        <p className="text-gray-600 -mt-0.5 mb-6 text-sm sm:text-base text-center">Manage and resolve school support tickets</p>
     

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 text-xs sm:text-sm">Total Tickets</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalTickets || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-xs sm:text-sm">Pending</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.pendingTickets || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border-l-4 border-blue-500">
          <p className="text-gray-600 text-xs sm:text-sm">In Progress</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.inProgressTickets || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 sm:p-4 border-l-4 border-green-500">
          <p className="text-gray-600 text-xs sm:text-sm">Resolved</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.resolvedTickets || 0}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FiFilter className="text-gray-600" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>

          </select>

          <select
            value={filters.issueArea}
            onChange={(e) => setFilters({ ...filters, issueArea: e.target.value })}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Issues</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>

          </select>
        </div>
      </div>

      {/* Tickets Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Area
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-3">Loading tickets...</span>
                    </div>
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No tickets found
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{ticket._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.school?.schoolName || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={ticket.title}>{ticket.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {ticket.issueArea}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 transition"
                      >
                        <AiOutlineEye className="text-lg" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tickets Cards - Mobile/Tablet */}
      <div className="lg:hidden space-y-3 sm:space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-500">Loading tickets...</span>
            </div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            No tickets found
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket._id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-500">
                      #{ticket._id.slice(-6).toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('-', ' ')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">{ticket.title}</h3>
                </div>
              </div>

              <div className="space-y-2 mb-3 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">School:</span>
                  <span className="text-gray-900 font-medium">{ticket.school?.school_name || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Issue Area:</span>
                  <span className="text-gray-900 capitalize">{ticket.issueArea}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span className="text-gray-900">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedTicket(ticket);
                  setShowModal(true);
                }}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition text-sm"
              >
                <AiOutlineEye className="text-lg" />
                View Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* Ticket Detail Modal */}
      {showModal && selectedTicket && (
        <TicketModal
          ticket={selectedTicket}
          onClose={() => {
            setShowModal(false);
            setSelectedTicket(null);
          }}
          onStatusUpdate={handleStatusUpdate}
          updating={updating}
          getStatusColor={getStatusColor}
        />
      )}
    </div>
  );
};

const TicketModal = ({ ticket, onClose, onStatusUpdate, updating, getStatusColor }) => {
  const [newStatus, setNewStatus] = useState(ticket.status);

  const handleSubmit = (e) => {
    e.preventDefault();
    onStatusUpdate(ticket._id, newStatus);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 rounded-t-lg z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ticket Details</h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">ID: #{ticket._id.slice(-6).toUpperCase()}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center transition"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* School Information */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 sm:p-5 mb-6 border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm sm:text-base">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              School Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs mb-1">School Name</span>
                <span className="text-gray-900 font-medium">{ticket.school?.school_name || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs mb-1">Principal Name</span>
                <span className="text-gray-900 font-medium">{ticket.school?.owner_name || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs mb-1">Email</span>
                <span className="text-gray-900 break-all">{ticket.school?.email || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600 text-xs mb-1">Phone</span>
                <span className="text-gray-900">{ticket.school?.phone || 'N/A'}</span>
              </div>
              {ticket.school?.city && (
                <div className="flex flex-col">
                  <span className="text-gray-600 text-xs mb-1">City</span>
                  <span className="text-gray-900">{ticket.school.city}</span>
                </div>
              )}
              {ticket.school?.state && (
                <div className="flex flex-col">
                  <span className="text-gray-600 text-xs mb-1">State</span>
                  <span className="text-gray-900">{ticket.school.state}</span>
                </div>
              )}
            </div>
          </div>

          {/* Ticket Details */}
          <div className="mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(ticket.status)}`}>
                  {ticket.status.replace('-', ' ')}
                </span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Issue Area</label>
                <p className="text-sm text-gray-900 capitalize">{ticket.issueArea}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Created At</label>
                <p className="text-sm text-gray-900">{new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-2">Title</label>
              <p className="text-sm sm:text-base text-gray-900 font-medium">{ticket.title}</p>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-600 mb-2">Description</label>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{ticket.description}</p>
              </div>
            </div>

            {Array.isArray(ticket.ticketImages) && ticket.ticketImages.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-3">Attached Images</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {ticket.ticketImages.map((image, index) => (
                    <a
                      key={index}
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <img
                        src={image}
                        alt={`Ticket image ${index + 1}`}
                        className="w-full h-32 sm:h-40 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-500 group-hover:shadow-lg transition"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Update Status Form */}
          <form onSubmit={handleSubmit} className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4 text-base sm:text-lg">Update Ticket Status</h3>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>

              </select>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={updating}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition font-medium text-sm sm:text-base"
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Ticket;