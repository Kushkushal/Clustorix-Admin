import React, { useState, useEffect } from 'react';
import { ImTicket } from "react-icons/im";
import { FiFilter, FiSearch, FiX } from "react-icons/fi";
import { AiOutlineEye } from "react-icons/ai";
import { ArrowLeftIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Ticket = () => {
  const { api } = useAuth();

  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolTickets, setSchoolTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const [filters, setFilters] = useState({
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

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const response = await api.get('/v1/schools');
      const schoolsData = response.data?.data || [];
      setSchools(schoolsData);
    } catch (error) {
      showNotification('Failed to fetch schools', 'error');
      console.error('Error fetching schools:', error);
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

  const fetchSchoolTickets = async (schoolId) => {
    try {
      setLoadingTickets(true);
      const response = await api.get(`/v1/tickets/school/${schoolId}`);
      const ticketsData = response.data?.data || [];
      const normalizedTickets = Array.isArray(ticketsData) ? ticketsData.map(ticket => ({
        ...ticket,
        ticketImages: Array.isArray(ticket.ticketImages) ? ticket.ticketImages : []
      })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];
      setSchoolTickets(normalizedTickets);
    } catch (error) {
      showNotification('Failed to fetch school tickets', 'error');
      console.error('Error fetching school tickets:', error);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchSchools();
    fetchStats();
  }, []);

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      setUpdating(true);
      const payload = { status: newStatus };
      await api.put(`/v1/tickets/${ticketId}/status`, payload);
      showNotification('Ticket status updated successfully', 'success');
      setShowModal(false);
      setSelectedTicket(null);
      if (selectedSchool) {
        fetchSchoolTickets(selectedSchool._id);
      }
      fetchStats();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update ticket status';
      showNotification(errorMessage, 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleViewTickets = (school) => {
    setSelectedSchool(school);
    fetchSchoolTickets(school._id);
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

  const filteredSchools = schools.filter(school =>
    !filters.search ||
    school.school_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
    school.email?.toLowerCase().includes(filters.search.toLowerCase()) ||
    school.owner_name?.toLowerCase().includes(filters.search.toLowerCase())
  );

  // School Tickets View
  if (selectedSchool) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 -mt-3">
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 px-4 sm:px-6 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white animate-fade-in max-w-sm`}>
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm sm:text-base">{notification.message}</span>
              <button onClick={() => setNotification({ show: false, message: '', type: '' })}>
                <FiX className="text-xl" />
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            setSelectedSchool(null);
            setSchoolTickets([]);
          }}
          className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 mb-6 font-medium"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Back to Schools</span>
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-3">
            <h2 className="text-white font-semibold text-base sm:text-lg text-center">School Ticket Overview</h2>
          </div>

          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* School Image and Basic Info */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1">

                <div className="flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 break-words text-center">
                    {selectedSchool.school_name}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <div className="flex-1 min-w-0">

                        <p className="text-sm text-gray-900 font-semibold truncate" title={selectedSchool.owner_name}>
                          {selectedSchool.owner_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <div className="flex-1 min-w-0">

                        <p className="text-sm text-gray-900 font-semibold truncate" title={selectedSchool.email}>
                          {selectedSchool.email}
                        </p>
                      </div>
                    </div>

                    {selectedSchool.phone && (
                      <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 font-semibold">
                            {selectedSchool.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {(selectedSchool.city || selectedSchool.state) && (
                      <div className="flex items-start space-x-2">
                        <svg className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 font-medium">Location</p>
                          <p className="text-sm text-gray-900 font-semibold">
                            {[selectedSchool.city, selectedSchool.state].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ticket Stats Card */}
              <div className="lg:w-48 flex-shrink-0">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border-2 border-indigo-100 h-full flex flex-col items-center justify-center text-center">
                  {/* <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mb-1 shadow-lg">
                    <ImTicket className="text-3xl text-white" />
                  </div> */}
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Tickets</p>
                  <p className="text-4xl font-bold text-indigo-600">{schoolTickets.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loadingTickets ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-500">Loading tickets...</span>
            </div>
          </div>
        ) : schoolTickets.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <ImTicket className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Tickets Found</h3>
            <p className="text-gray-600">This school hasn't submitted any support tickets yet.</p>
          </div>
        ) : (
          <>
            <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Area</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {schoolTickets.map((ticket) => (
                      <tr key={ticket._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{ticket._id.slice(-6).toUpperCase()}
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
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:hidden space-y-3 sm:space-y-4">
              {schoolTickets.map((ticket) => (
                <div key={ticket._id} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    {/* Left Block: ID and Title */}
                    <div className="flex-1 min-w-0 pr-4"> {/* Added pr-4 for spacing */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-500">
                          #{ticket._id.slice(-6).toUpperCase()}
                        </span>
                        {/* The Status span is removed from here */}
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">{ticket.title}</h3>
                    </div>

                    {/* Right Block: Status Badge (Now separate for 'justify-between') */}
                    <div className="flex-shrink-0">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3 text-xs sm:text-sm">
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
              ))}
            </div>
          </>
        )}

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
  }

  // Main School List View
  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6 -mt-3">
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 sm:px-6 py-3 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white animate-fade-in max-w-sm`}>
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
      <p className="text-gray-600 -mt-0.5 mb-6 text-sm sm:text-base text-center">View and manage support tickets by school</p>

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

      <div className="bg-white rounded-lg shadow p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FiFilter className="text-gray-600" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Search Schools</h2>
        </div>

        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by school name, email, or owner..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-500">Loading schools...</span>
          </div>
        </div>
      ) : filteredSchools.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Schools Found</h3>
          <p className="text-gray-600">
            {filters.search ? 'Try adjusting your search' : 'No schools registered yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredSchools.map((school) => (
            <div key={school._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <div className="relative h-40 sm:h-48 bg-gradient-to-br from-indigo-500 to-purple-600">
                {school.school_image ? (
                  <img
                    src={school.school_image}
                    alt={school.school_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <AcademicCapIcon className="w-16 h-16 sm:w-20 sm:h-20 text-white opacity-50" />
                  </div>
                )}
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 truncate" title={school.school_name}>
                  {school.school_name}
                </h3>

                <div className="space-y-1.5 text-xs sm:text-sm text-gray-600 mb-3">
                  <div className="flex items-start">
                    <span className="font-medium w-16 flex-shrink-0">Owner:</span>
                    <span className="flex-1 truncate" title={school.owner_name}>{school.owner_name}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium w-16 flex-shrink-0">Email:</span>
                    <span className="flex-1 truncate" title={school.email}>{school.email}</span>
                  </div>
                  {school.phone && (
                    <div className="flex items-start">
                      <span className="font-medium w-16 flex-shrink-0">Phone:</span>
                      <span className="flex-1">{school.phone}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleViewTickets(school)}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
                >
                  <ImTicket className="text-base" />
                  <span>View Tickets</span>
                </button>
              </div>
            </div>
          ))}
        </div>
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

        <div className="p-4 sm:p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {ticket.school && (
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
              </div>
            </div>
          )}

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