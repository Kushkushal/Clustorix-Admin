import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  TicketIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Schools', href: '/admin/schools', icon: AcademicCapIcon },
  { name: 'Trainers', href: '/admin/trainers', icon: UserGroupIcon },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCardIcon },
  { name: 'Tickets', href: '/admin/tickets', icon: TicketIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >

        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 h-16 bg-indigo-600 lg:justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="https://tse2.mm.bing.net/th/id/OIP.W_EbJmg3TbmBPxBLzB1-swHaHa?pid=ImgDet&w=184&h=184&c=7&dpr=1.3&o=7&rm=3" // This will be the URL to the image with a transparent background
                  alt="[translate:School Logo]"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-lg font-bold text-white">Clustorix Admin</span>
            </div>


            {/* Close button (mobile only) */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-white hover:bg-indigo-700 rounded-lg lg:hidden"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${active
                    ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                    }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon
                    className={`w-6 h-6 mr-3 transition-colors ${active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-600'
                      }`}
                    aria-hidden="true"
                  />
                  <span className="font-medium">{item.name}</span>

                  {/* Active indicator */}
                  {active && (
                    <span className="ml-auto w-2 h-2 bg-indigo-600 rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-sm">CA</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Clustorix Admin</p>
                <p className="text-xs text-gray-500">Version 1.0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;