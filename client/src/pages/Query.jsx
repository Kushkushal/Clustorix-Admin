import React, { useState, useEffect } from 'react';
import { IoAccessibility } from "react-icons/io5";
import { collection, getDocs, deleteDoc, doc, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { 
  FaTrash, 
  FaEnvelope, 
  FaUser, 
  FaCommentDots, 
  FaCalendar, 
  FaSearch, 
  FaFilter,
  FaCheckCircle,
  FaTimes
} from 'react-icons/fa';

const Query = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    setLoading(true);
    setError(null);
    try {
      const contactsQuery = query(
        collection(db, "contacts"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(contactsQuery);
      const queriesData = querySnapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        ...docSnapshot.data(),
        read: docSnapshot.data().read || false // Get read status from Firestore
      }));
      setQueries(queriesData);
    } catch (err) {
      console.error("Error fetching queries:", err);
      setError("Failed to load queries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "contacts", id));
      setQueries(queries.filter(q => q.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting query:", err);
      alert("Failed to delete query. Please try again.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleRead = async (id) => {
    try {
      // Find the current query
      const currentQuery = queries.find(q => q.id === id);
      const newReadStatus = !currentQuery.read;
      
      // Update in Firestore
      await updateDoc(doc(db, "contacts", id), {
        read: newReadStatus
      });
      
      // Update local state
      setQueries(queries.map(q => 
        q.id === id ? { ...q, read: newReadStatus } : q
      ));
    } catch (err) {
      console.error("Error updating read status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const filteredQueries = queries.filter(q => {
    const matchesSearch = 
      q.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' ? true :
      filterStatus === 'read' ? q.read :
      !q.read;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen  py-4 px-3 sm:py-6 sm:px-4 lg:py-8 lg:px-6 -mt-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
       
            <div className="flex items-center justify-center space-x-3">
                    <IoAccessibility className="text-2xl text-gray-700" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-0.5">
              Customer Queries
            </h1>
            </div>
         
          <p className="text-gray-600 -mt-0.5 mb-6 text-sm sm:text-base text-center">
            Manage and respond to customer inquiries efficiently
          </p>
       

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6 mt-5">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-t-4 border-indigo-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Total Queries</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{queries.length}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-full">
                <FaCommentDots className="text-indigo-600 text-xl sm:text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-t-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Read</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {queries.filter(q => q.read).length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="text-green-600 text-xl sm:text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-t-4 border-orange-500 hover:shadow-xl transition-shadow duration-300 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs sm:text-sm font-medium mb-1">Unread</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {queries.filter(q => !q.read).length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <FaEnvelope className="text-orange-600 text-xl sm:text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by name, email, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm sm:text-base"
              />
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="bg-gray-100 p-2.5 rounded-lg">
                <FaFilter className="text-gray-500 text-sm" />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white font-medium text-sm sm:text-base transition-all"
              >
                <option value="all">All Queries</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
            <p className="mt-4 text-gray-600 text-sm sm:text-base font-medium">Loading queries...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 bg-red-100 p-2 rounded-full">
                <FaTimes className="text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-red-800 font-medium text-sm sm:text-base">{error}</p>
                <button
                  onClick={fetchQueries}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredQueries.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
            <div className="bg-gray-100 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCommentDots className="text-gray-300 text-3xl sm:text-4xl" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No queries found</h3>
            <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Customer queries will appear here when submitted'}
            </p>
          </div>
        )}

        {/* Queries List */}
        {!loading && !error && filteredQueries.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {filteredQueries.map((queryItem) => (
              <div
                key={queryItem.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                  !queryItem.read ? 'border-l-4 sm:border-l-[6px] border-indigo-500' : ''
                }`}
              >
                <div className="p-4 sm:p-6">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 sm:p-2.5 rounded-full flex-shrink-0">
                          <FaUser className="text-white text-sm sm:text-base" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">
                            {queryItem.name}
                          </h3>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                            <FaEnvelope className="flex-shrink-0" />
                            <span className="truncate">{queryItem.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      {!queryItem.read && (
                        <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold rounded-full shadow-md">
                          New
                        </span>
                      )}
                      <button
                        onClick={() => toggleRead(queryItem.id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          queryItem.read 
                            ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                            : 'bg-green-500 text-white hover:bg-green-600 shadow-md'
                        }`}
                      >
                        {queryItem.read ? 'Mark Unread' : 'Mark Read'}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(queryItem.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:shadow-md"
                        title="Delete query"
                      >
                        <FaTrash className="text-sm sm:text-base" />
                      </button>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-3 sm:p-4 mb-3 border border-gray-200">
                    <div className="flex items-start gap-2 mb-2">
                      <FaCommentDots className="text-indigo-500 mt-1 flex-shrink-0" />
                      <p className="text-xs sm:text-sm font-semibold text-gray-700">Message:</p>
                    </div>
                    <p className="text-sm sm:text-base text-gray-800 leading-relaxed ml-0 sm:ml-6 break-words">
                      {queryItem.message}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center text-xs sm:text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                    <FaCalendar className="mr-2 flex-shrink-0" />
                    <span className="font-medium">Received: {formatDate(queryItem.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 transform transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <FaTrash className="text-red-600 text-xl" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Delete Query?
                </h3>
              </div>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Are you sure you want to delete this query? This action cannot be undone and the data will be permanently removed.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg text-sm sm:text-base"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Query;