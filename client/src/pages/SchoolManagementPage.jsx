import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  XMarkIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { FaGraduationCap } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const SchoolManagementPage = () => {
  const { api } = useAuth();

  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState({ show: false, school: null });
  const [statusModal, setStatusModal] = useState({ show: false, school: null, newStatus: false });
  const [viewSchool, setViewSchool] = useState(null);
  const [schoolStats, setSchoolStats] = useState({ students: 0, teachers: 0, classes: 0, totalFees: 0 });
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    filterSchools();
  }, [schools, searchTerm, statusFilter]);

  useEffect(() => {
    if (viewSchool) {
      fetchSchoolStats(viewSchool._id);
    }
  }, [viewSchool]);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      console.log('🏫 Fetching schools...');

      const { data } = await api.get('/v1/schools');

      console.log('✅ Schools fetched:', data.data?.length || 0);
      setSchools(data.data);
      setFilteredSchools(data.data);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching schools:', err);

      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        setTimeout(() => window.location.href = '/login', 2000);
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view schools.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch schools');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSchoolStats = async (schoolId) => {
    setLoadingStats(true);
    try {
      // Fetch students, teachers, classes, and fees for this school
      const [studentsResponse, teachersResponse, classesResponse, feesResponse] = await Promise.all([
        api.get(`/v1/students/school/${schoolId}`),
        api.get(`/v1/teachers/school/${schoolId}`),
        api.get(`/v1/classes/school/${schoolId}`),
        api.get(`/v1/fees/school/${schoolId}`)
      ]);

      console.log('✅ School stats fetched - Students:', studentsResponse.data.count, 'Teachers:', teachersResponse.data.count, 'Classes:', classesResponse.data.count);

      // Calculate total fees from fees collection
      const feesRecords = feesResponse.data.data || [];
      const totalFees = feesRecords.reduce((sum, feeRecord) => {
        // Sum up totalFees from all installments
        const recordTotal = (feeRecord.installments || []).reduce((installmentSum, installment) => {
          return installmentSum + (parseFloat(installment.totalFees) || 0);
        }, 0);
        return sum + recordTotal;
      }, 0);

      console.log('💰 Total fees calculated:', totalFees);

      setSchoolStats({
        students: studentsResponse.data.count || 0,
        teachers: teachersResponse.data.count || 0,
        classes: classesResponse.data.count || 0,
        totalFees: totalFees
      });
    } catch (err) {
      console.error('❌ Error fetching school stats:', err);
      setSchoolStats({ students: 0, teachers: 0, classes: 0, totalFees: 0 });
    } finally {
      setLoadingStats(false);
    }
  };

  const filterSchools = () => {
    let filtered = schools;

    if (searchTerm) {
      filtered = filtered.filter(school =>
        school.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.owner_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(school =>
        statusFilter === 'active' ? school.isActive : !school.isActive
      );
    }

    setFilteredSchools(filtered);
  };

  const handleStatusChange = async () => {
    if (!statusModal.school) return;

    try {
      console.log('🔄 Updating school status...');

      const { data } = await api.put(
        `/v1/schools/${statusModal.school._id}`,
        { isActive: statusModal.newStatus }
      );

      if (data.success) {
        console.log('✅ School status updated');
        setSchools(schools.map(school =>
          school._id === statusModal.school._id
            ? { ...school, isActive: statusModal.newStatus }
            : school
        ));
        if (viewSchool && viewSchool._id === statusModal.school._id) {
          setViewSchool({ ...viewSchool, isActive: statusModal.newStatus });
        }
        setStatusModal({ show: false, school: null, newStatus: false });
      }
    } catch (err) {
      console.error('❌ Error updating school:', err);
      alert(err.response?.data?.message || 'Failed to update school status');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.school) return;

    try {
      console.log('🗑️ Deleting school...');

      const { data } = await api.delete(`/v1/schools/${deleteModal.school._id}`);

      if (data.success) {
        console.log('✅ School deleted');
        setSchools(schools.filter(s => s._id !== deleteModal.school._id));
        setDeleteModal({ show: false, school: null });
        if (viewSchool && viewSchool._id === deleteModal.school._id) {
          setViewSchool(null);
        }
      }
    } catch (err) {
      console.error('❌ Error deleting school:', err);
      alert(err.response?.data?.message || 'Failed to delete school');
    }
  };

  if (viewSchool) {
    return (
      <div className="min-h-screen bg-gray-50 pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setViewSchool(null)}
            className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 mb-6 mt-6"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">Back to Schools</span>
          </button>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-48 sm:h-64 md:h-80 bg-gradient-to-br from-indigo-500 to-purple-600">
              {viewSchool.school_image ? (
                <img
                  src={viewSchool.school_image}
                  alt={viewSchool.school_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <AcademicCapIcon className="w-24 h-24 sm:w-32 sm:h-32 text-white opacity-50" />
                </div>
              )}

              <div className="absolute top-4 right-4">
                {viewSchool.isActive ? (
                  <span className="flex items-center space-x-2 bg-green-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
                    <CheckCircleIcon className="w-5 h-5" />
                    <span>Active</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2 bg-red-500 text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg">
                    <XCircleIcon className="w-5 h-5" />
                    <span>Inactive</span>
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {viewSchool.school_name}
              </h1>

              {viewSchool.description && (
                <p className="text-gray-600 text-base sm:text-lg mb-6">
                  {viewSchool.description}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600 mb-1">Total Students</p>
                      {loadingStats ? (
                        <div className="h-8 w-16 bg-blue-200 animate-pulse rounded"></div>
                      ) : (
                        <p className="text-3xl font-bold text-blue-900">{schoolStats.students}</p>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600 mb-1">Total Teachers</p>
                      {loadingStats ? (
                        <div className="h-8 w-16 bg-purple-200 animate-pulse rounded"></div>
                      ) : (
                        <p className="text-3xl font-bold text-purple-900">{schoolStats.teachers}</p>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600 mb-1">Total Classes</p>
                      {loadingStats ? (
                        <div className="h-8 w-16 bg-green-200 animate-pulse rounded"></div>
                      ) : (
                        <p className="text-3xl font-bold text-green-900">{schoolStats.classes}</p>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600 mb-1">Total Fees</p>
                      {loadingStats ? (
                        <div className="h-8 w-20 bg-orange-200 animate-pulse rounded"></div>
                      ) : (
                        <p className="text-3xl font-bold text-orange-900">₹{schoolStats.totalFees.toLocaleString('en-IN')}</p>
                      )}
                    </div>
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <AcademicCapIcon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500">Owner</p>
                    <p className="text-base font-semibold text-gray-900 break-words">
                      {viewSchool.owner_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <EnvelopeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base font-semibold text-gray-900 break-all">
                      {viewSchool.email}
                    </p>
                  </div>
                </div>

                {viewSchool.phone && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <PhoneIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      <p className="text-base font-semibold text-gray-900">
                        {viewSchool.phone}
                      </p>
                    </div>
                  </div>
                )}

                {viewSchool.address && (
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <MapPinIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-base font-semibold text-gray-900 break-words">
                        {viewSchool.address}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-500">Registered</p>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(viewSchool.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setStatusModal({
                    show: true,
                    school: viewSchool,
                    newStatus: !viewSchool.isActive
                  })}
                  className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition ${viewSchool.isActive
                    ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                >
                  <PencilIcon className="w-5 h-5" />
                  <span>{viewSchool.isActive ? 'Deactivate School' : 'Activate School'}</span>
                </button>

                <button
                  onClick={() => setDeleteModal({ show: true, school: viewSchool })}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition"
                >
                  <TrashIcon className="w-5 h-5" />
                  <span>Delete School</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading schools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600 font-semibold">{error}</p>
        <button
          onClick={fetchSchools}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center space-x-3">
          <FaGraduationCap className="text-3xl text-gray-700" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-0.5">
            School Management
          </h1>
        </div>

        <p className="text-gray-600 -mt-0.5 mb-6 text-sm sm:text-base text-center">
          Manage and monitor all registered schools
        </p>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 mt-2">
          <div className="flex items-center space-x-1">
            <AcademicCapIcon className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Total: <strong>{schools.length}</strong></span>
          </div>
          <span className="text-green-600">• Active: <strong>{schools.filter(s => s.isActive).length}</strong></span>
          <span className="text-red-600">• Inactive: <strong>{schools.filter(s => !s.isActive).length}</strong></span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by school name, email, or owner..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <FunnelIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-24 sm:w-28 px-2 sm:px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-gray-600">
          Showing <strong>{filteredSchools.length}</strong> of <strong>{schools.length}</strong> schools
        </div>
      </div>

      {filteredSchools.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
          <AcademicCapIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No schools found</h3>
          <p className="text-sm sm:text-base text-gray-600">
            {searchTerm || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'No schools registered yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredSchools.map((school) => (
            <div
              key={school._id}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
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

                <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                  {school.isActive ? (
                    <span className="flex items-center space-x-1 bg-green-500 text-white text-xs font-medium px-2 sm:px-3 py-1 rounded-full">
                      <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Active</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 bg-red-500 text-white text-xs font-medium px-2 sm:px-3 py-1 rounded-full">
                      <XCircleIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Inactive</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 truncate">
                  {school.school_name}
                </h3>

                <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  <div className="flex items-start">
                    <span className="font-medium w-16 sm:w-20 flex-shrink-0">Owner:</span>
                    <span className="flex-1 break-words">{school.owner_name}</span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium w-16 sm:w-20 flex-shrink-0">Email:</span>
                    <span className="flex-1 truncate">{school.email}</span>
                  </div>
                  {school.phone && (
                    <div className="flex items-start">
                      <span className="font-medium w-16 sm:w-20 flex-shrink-0">Phone:</span>
                      <span className="flex-1">{school.phone}</span>
                    </div>
                  )}
                  <div className="flex items-start">
                    <span className="font-medium w-16 sm:w-20 flex-shrink-0">Registered:</span>
                    <span className="flex-1">{new Date(school.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewSchool(school)}
                    className="flex-1 flex items-center justify-center space-x-1 px-2 sm:px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition"
                  >
                    <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium">View</span>
                  </button>

                  <button
                    onClick={() => setStatusModal({
                      show: true,
                      school,
                      newStatus: !school.isActive
                    })}
                    className={`flex-1 flex items-center justify-center space-x-1 px-2 sm:px-3 py-2 rounded-lg transition ${school.isActive
                      ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                  >
                    <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">
                      {school.isActive ? 'Deactivate' : 'Activate'}
                    </span>
                    <span className="text-xs font-medium sm:hidden">
                      {school.isActive ? 'Off' : 'On'}
                    </span>
                  </button>

                  <button
                    onClick={() => setDeleteModal({ show: true, school })}
                    className="px-2 sm:px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {statusModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Confirm Status Change</h3>
              <button
                onClick={() => setStatusModal({ show: false, school: null, newStatus: false })}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Are you sure you want to <strong>{statusModal.newStatus ? 'activate' : 'deactivate'}</strong>{' '}
              <strong>{statusModal.school?.school_name}</strong>?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setStatusModal({ show: false, school: null, newStatus: false })}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusChange}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition font-medium ${statusModal.newStatus
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-yellow-600 hover:bg-yellow-700'
                  }`}
              >
                {statusModal.newStatus ? 'Activate' : 'Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Confirm Delete</h3>
              <button
                onClick={() => setDeleteModal({ show: false, school: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteModal.school?.school_name}</strong>?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setDeleteModal({ show: false, school: null })}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolManagementPage;