import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, UsersIcon, ScaleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const FeatureCard = ({ title, description, icon: Icon, actionText, actionLink = "#" }) => (
  <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col justify-start items-start 
                  hover:shadow-indigo-500/50 transition duration-500 transform hover:-translate-y-2 border border-gray-100">
    <Icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-indigo-600 mb-3 sm:mb-4" />
    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{title}</h3>
    <p className="text-gray-600 flex-grow text-xs sm:text-sm md:text-base mb-4 sm:mb-6">{description}</p>
    <Link to={actionLink} className="text-xs sm:text-sm md:text-base font-semibold text-indigo-600 hover:text-indigo-800 transition duration-200 flex items-center group">
      {actionText}
      <ArrowRightIcon className="w-4 h-4 ml-1 sm:ml-2 transition-transform group-hover:translate-x-1" />
    </Link>
  </div>
);

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
      
      {/* Background Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-black-700 to-purple-800 h-[60vh] z-0 rounded-bl-2xl rounded-br-2xl"></div>

      {/* Header (Fixed and Elevated) */}
      <header className="w-full p-4 md:p-6 flex justify-between items-center bg-white shadow-xl fixed top-0 z-10 border-b border-gray-200">
        <h1 className="text-lg md:text-2xl font-extrabold text-indigo-700 tracking-tight">
          Clustorix <span className="text-gray-500 font-medium">Portal</span>
        </h1>
        <Link
          to="/login"
          className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm md:text-base font-semibold rounded-full shadow-md 
                      hover:bg-indigo-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Admin Login
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </Link>
      </header>

      {/* Main Content (Offset for fixed header) */}
      <main className="flex-grow flex flex-col items-center justify-start px-4 text-center z-0 pt-28 md:pt-36 pb-16 max-w-full">
        
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto mb-16 relative px-2 sm:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 text-white leading-tight drop-shadow-lg max-w-full">
            Transforming <span className="text-yellow-300">Education Management</span> with Simplicity
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-indigo-200 max-w-full sm:max-w-3xl mx-auto mb-12 font-light px-4 sm:px-6">
            Your secure, centralized control panel for all Clustorix ERP and Academy systems, designed for speed and reliability.
          </p>
        </div>

        {/* Feature Cards Section (Responsive Grid) */}
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-8 px-2 sm:px-4">
          <FeatureCard 
            title="Subscription & Billing"
            description="Manage dynamic pricing, handle plan upgrades/downgrades, and view payment history for all client schools."
            icon={ScaleIcon}
            actionText="View Pricing Details"
            actionLink="/pricing"
          />

          <FeatureCard 
            title="Client School Directory"
            description="Access a complete list of all active and pending client accounts, along with their assigned administrators and modules."
            icon={UsersIcon}
            actionText="Browse Accounts"
            actionLink="/accounts"
          />

          <FeatureCard 
            title="Service Desk Overview"
            description="Monitor real-time support ticket volume, track resolution times, and analyze common issues to improve service quality."
            icon={CheckCircleIcon}
            actionText="Go to Support Panel"
            actionLink="/support"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-black mt-auto rounded-t-lg">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div className="flex justify-center items-center">
      <p className="text-sm text-white text-center">© {new Date().getFullYear()} Clustorix Admin Portal. All rights reserved.</p>
    </div>
  </div>
</footer>


    </div>
  );
};

export default LandingPage;
