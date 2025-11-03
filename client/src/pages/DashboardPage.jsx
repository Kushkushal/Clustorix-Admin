import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AcademicCapIcon,
  UsersIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { FaHome } from 'react-icons/fa';
import { baseUrl } from '../../../client/src/environment';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSchools: 0,
    totalStudents: 0,
    totalTeachers: 25, // Mock data
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch Schools
      const schoolsResponse = await axios.get(`${baseUrl}/v1/schools`, {
        withCredentials: true
      });
      
      // Fetch Students
      const studentsResponse = await axios.get(`${baseUrl}/v1/students`, {
        withCredentials: true
      });

      const schools = schoolsResponse.data.data || [];
      const students = studentsResponse.data.data || [];

      setStats({
        totalSchools: schools.length,
        activeSchools: schools.filter(s => s.isActive).length,
        totalStudents: students.length,
        totalTeachers: 25, // Mock data - will be replaced when teacher API is ready
      });

      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
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
        <p className="text-red-600">{error}</p>
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
      trend: '+5%',
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mt-1">
                      {card.value.toLocaleString()}
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
                  <div className={`flex items-center space-x-1 text-sm font-medium ${
                    card.trendUp ? 'text-green-600' : 'text-red-600'
                  }`}>
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

        {/* <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Students/School</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalSchools > 0 
                  ? Math.round(stats.totalStudents / stats.totalSchools)
                  : 0
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div> */}

        {/* <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Student-Teacher Ratio</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalTeachers > 0
                  ? `${Math.round(stats.totalStudents / stats.totalTeachers)}:1`
                  : 'N/A'
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div> */}
      </div>

      {/* Recent Activity Section */}
      {/* <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition">
            <AcademicCapIcon className="w-6 h-6 text-indigo-600" />
            <span className="font-medium text-indigo-600">View All Schools</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition">
            <UsersIcon className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-blue-600">View All Students</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition">
            <UserGroupIcon className="w-6 h-6 text-green-600" />
            <span className="font-medium text-green-600">View All Teachers</span>
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default DashboardPage;