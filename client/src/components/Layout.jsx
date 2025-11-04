import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bars3Icon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutConfirm = async () => {
    await logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
      >
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left: Menu button */}
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  aria-label="Toggle sidebar"
                >
                  <Bars3Icon className="w-6 h-6" />
                </button>

                {/* Page title (optional on mobile) */}
                <h1 className="ml-3 text-lg font-semibold text-gray-900 lg:hidden">
                  Clustorix Admin
                </h1>
              </div>

              {/* Right: Notifications, User info, Logout */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                  aria-label="Notifications"
                >
                  <BellIcon className="w-6 h-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User info */}
                {user && (
                  <div className="hidden md:flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Logout button */}
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150"
                  aria-label="Logout"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-black mt-auto rounded-t-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-center items-center">
              <p className="text-sm text-white text-center">
                © {new Date().getFullYear()} Clustorix Admin Portal. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fadeIn">
              <div className="flex items-center justify-center mb-5 relative">
                <h3 className="text-xl font-semibold text-gray-900 text-center w-full">
                  Confirm Logout
                </h3>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="absolute right-0 top-0 text-gray-400 hover:text-gray-700 transition-colors rounded-full p-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  aria-label="Close logout modal"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
              <p className="text-base text-gray-700 mb-6 leading-relaxed text-center">
                Are you sure you want to logout?
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
