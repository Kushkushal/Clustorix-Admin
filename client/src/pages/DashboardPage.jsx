import React, { useState, useEffect } from 'react';
import {
  AcademicCapIcon,
  UsersIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CircleStackIcon
} from '@heroicons/react/24/outline';
import { FaHome, FaDatabase } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { api } = useAuth();

  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalFees: 0,
  });

  const [dbStats, setDbStats] = useState({
    dataSize: 0,
    totalSize: 0,
    maxStorage: 0,
    usedPercentage: 0,
    freePercentage: 100,
    collections: 0,
    objects: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Indian Currency Formatter - Converts to K, L, Cr format
  const formatIndianCurrency = (amount) => {
    if (!amount || amount === 0) return '₹0';
    
    const absAmount = Math.abs(amount);
    
    // 1 Crore = 10,000,000
    if (absAmount >= 10000000) {
      const crores = (absAmount / 10000000).toFixed(2);
      return `₹${crores} Cr`;
    }
    
    // 1 Lakh = 100,000
    if (absAmount >= 100000) {
      const lakhs = (absAmount / 100000).toFixed(2);
      return `₹${lakhs} L`;
    }
    
    // 1 Thousand = 1,000
    if (absAmount >= 1000) {
      const thousands = (absAmount / 1000).toFixed(2);
      return `₹${thousands} K`;
    }
    
    // Less than 1000
    return `₹${absAmount.toLocaleString('en-IN')}`;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching dashboard data...');

      const [
        schoolsResponse,
        studentsResponse,
        teachersResponse,
        dbStatsResponse,
        feesStatsResponse,
      ] = await Promise.all([
        api.get('/v1/schools'),
        api.get('/v1/students'),
        api.get('/v1/teachers'),
        api.get('/v1/stats/db-stats'),
        api.get('/v1/fees/stats/summary'),
      ]);

      console.log('✅ Schools fetched:', schoolsResponse.data.data?.length || 0);
      console.log('✅ Students fetched:', studentsResponse.data.data?.length || 0);
      console.log('✅ Teachers fetched:', teachersResponse.data.data?.length || 0);
      console.log('✅ DB Stats fetched:', dbStatsResponse.data.data);
      console.log('✅ Fees stats fetched:', feesStatsResponse.data.data);

      const schools = schoolsResponse.data.data || [];
      const students = studentsResponse.data.data || [];
      const teachers = teachersResponse.data.data || [];
      const dbData = dbStatsResponse.data.data || {};
      const feesStats = feesStatsResponse.data.data || {};

      setStats({
        totalSchools: schools.length,
        activeSchools: schools.filter(s => s.isActive).length,
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalFees: feesStats.totalFeesAmount || 0,
      });

      setDbStats(dbData);
      setError(null);
    } catch (err) {
      console.error('❌ Error fetching dashboard data:', err);

      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (err.response?.status === 403) {
        setError('You do not have permission to access this data.');
      } else {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600 font-semibold">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Schools',
      value: stats.totalSchools,
      subtitle: `${stats.activeSchools} active`,
      icon: AcademicCapIcon,
      color: 'indigo',
      bgGradient: 'from-indigo-500 to-indigo-600',
      trend: stats.totalSchools > 0 ? '+12%' : null,
      trendUp: true
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      subtitle: 'Enrolled students',
      icon: UsersIcon,
      color: 'blue',
      bgGradient: 'from-blue-500 to-blue-600',
      trend: stats.totalStudents > 0 ? '+8%' : null,
      trendUp: true
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers,
      subtitle: 'Active teachers',
      icon: UserGroupIcon,
      color: 'green',
      bgGradient: 'from-green-500 to-green-600',
      trend: stats.totalTeachers > 0 ? '+5%' : null,
      trendUp: true
    },
    {
      title: 'Total Fees',
      value: stats.totalFees,
      subtitle: 'Sum of all fees',
      icon: AcademicCapIcon,
      color: 'yellow',
      bgGradient: 'from-yellow-500 to-yellow-600',
      trend: stats.totalFees > 0 ? '+10%' : null,
      trendUp: true,
      isCurrency: true
    },
    {
      title: 'Database Storage',
      value: formatBytes(dbStats.totalSize),
      subtitle: `${dbStats.usedPercentage}% used`,
      icon: CircleStackIcon,
      color: 'purple',
      bgGradient: 'from-purple-500 to-purple-600',
      trend: null,
      trendUp: true
    }
  ];

  return (
    <div className="space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3">
          <FaHome className="text-3xl text-gray-700" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-0.5">
            School Management
          </h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">
          Welcome back! Here's what's happening with your institution.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Card Header with Gradient */}
            <div className={`bg-gradient-to-br ${card.bgGradient} p-6`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white bg-opacity-30 rounded-lg p-3">
                    <card.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-opacity-90 text-sm font-medium">
                      {card.title}
                    </p>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                      {card.isCurrency
                        ? formatIndianCurrency(card.value)
                        : typeof card.value === 'number'
                          ? card.value.toLocaleString()
                          : card.value}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-gray-50 px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">{card.subtitle}</p>
                {card.trend && (
                  <div
                    className={`flex items-center space-x-1 text-sm font-medium ${
                      card.trendUp ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {card.trendUp ? (
                      <ArrowTrendingUpIcon className="w-4 h-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="w-4 h-4" />
                    )}
                    <span>{card.trend}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Storage Stats */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <FaDatabase className="text-2xl text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">Database Storage Details</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium mb-1">Total Used</p>
            <p className="text-2xl font-bold text-blue-900">{formatBytes(dbStats.totalSize)}</p>
            <p className="text-xs text-blue-600 mt-1">{dbStats.usedPercentage}% of quota</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium mb-1">Available</p>
            <p className="text-2xl font-bold text-green-900">
              {formatBytes(dbStats.maxStorage - dbStats.totalSize)}
            </p>
            <p className="text-xs text-green-600 mt-1">{dbStats.freePercentage}% free</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4">
            <p className="text-sm text-amber-600 font-medium mb-1">Collections</p>
            <p className="text-2xl font-bold text-amber-900">{dbStats.collections}</p>
            <p className="text-xs text-amber-600 mt-1">Database tables</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <p className="text-sm text-purple-600 font-medium mb-1">Total Records</p>
            <p className="text-2xl font-bold text-purple-900">{dbStats.objects?.toLocaleString()}</p>
            <p className="text-xs text-purple-600 mt-1">Across all collections</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Storage Usage</span>
            <span className="text-sm font-medium text-gray-700">{dbStats.usedPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                parseFloat(dbStats.usedPercentage) > 80
                  ? 'bg-red-500'
                  : parseFloat(dbStats.usedPercentage) > 60
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${dbStats.usedPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">{formatBytes(dbStats.totalSize)}</span>
            <span className="text-xs text-gray-500">{formatBytes(dbStats.maxStorage)}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Schools</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeSchools}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <AcademicCapIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Inactive Schools</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalSchools - stats.activeSchools}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AcademicCapIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;