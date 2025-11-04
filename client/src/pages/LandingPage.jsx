import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, UsersIcon, ScaleIcon, CheckCircleIcon, XMarkIcon, PlusIcon, MagnifyingGlassIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/24/solid';

const FeatureCard = ({ title, description, icon: Icon, actionText, onClick }) => (
  <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 flex flex-col justify-start items-start 
                  hover:shadow-indigo-500/50 transition duration-500 transform hover:-translate-y-2 border border-gray-100">
    <Icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-indigo-600 mb-3 sm:mb-4" />
    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{title}</h3>
    <p className="text-gray-600 flex-grow text-xs sm:text-sm md:text-base mb-4 sm:mb-6">{description}</p>
    <button onClick={onClick} className="text-xs sm:text-sm md:text-base font-semibold text-indigo-600 hover:text-indigo-800 transition duration-200 flex items-center group">
      {actionText}
      <ArrowRightIcon className="w-4 h-4 ml-1 sm:ml-2 transition-transform group-hover:translate-x-1" />
    </button>
  </div>
);

const PricingModal = ({ isOpen, onClose }) => {
  const plans = [
    {
      name: "Basic",
      students: "Up to 500",
      price: "₹49,999",
      period: "/year",
      features: [
        "Student Management System",
        "Attendance Tracking",
        "Basic Reports",
        "Email Support",
        "5 Admin Users"
      ],
      color: "from-blue-500 to-blue-600"
    },
    {
      name: "Standard",
      students: "Up to 1500",
      price: "₹99,999",
      period: "/year",
      features: [
        "All Basic Features",
        "Fee Management",
        "Advanced Reports & Analytics",
        "SMS Notifications",
        "15 Admin Users",
        "Parent Portal Access"
      ],
      color: "from-indigo-500 to-indigo-600",
      popular: true
    },
    {
      name: "Premium",
      students: "Unlimited",
      price: "₹1,99,999",
      period: "/year",
      features: [
        "All Standard Features",
        "Transport Management",
        "Library Management",
        "Examination Module",
        "Unlimited Admin Users",
        "24/7 Priority Support",
        "Custom Integrations",
        "Mobile App Access"
      ],
      color: "from-purple-500 to-purple-600"
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto pt-4 pb-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-7xl relative my-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black-800 hover:text-gray-600 transition bg-red-100 rounded-full p-2 shadow-lg z-10"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="p-6 sm:p-8 md:p-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Choose Your Plan
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Flexible pricing plans designed to grow with your institution
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-xl border-2 ${plan.popular ? 'border-indigo-500 lg:scale-105' : 'border-gray-200'
                  } p-6 sm:p-8 transition duration-300 hover:shadow-2xl`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className={`bg-gradient-to-r ${plan.color} rounded-xl p-4 mb-6`}>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-white opacity-90">{plan.students} Students</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-3xl sm:text-4xl font-extrabold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckIcon className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 rounded-xl font-semibold transition duration-300 ${plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 sm:p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Add-On Services</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-sm">
              <div className="flex items-center">
                <PlusIcon className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" />
                <span className="text-gray-700">Extra Users: ₹1,999/user/year</span>
              </div>
              <div className="flex items-center">
                <PlusIcon className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" />
                <span className="text-gray-700">Data Migration: ₹29,999 (one-time)</span>
              </div>
              <div className="flex items-center">
                <PlusIcon className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" />
                <span className="text-gray-700">Custom Training: ₹9,999/session</span>
              </div>
              <div className="flex items-center">
                <PlusIcon className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" />
                <span className="text-gray-700">WhatsApp Integration: ₹14,999/year</span>
              </div>
              <div className="flex items-center">
                <PlusIcon className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" />
                <span className="text-gray-700">Biometric Integration: ₹24,999</span>
              </div>
              <div className="flex items-center">
                <PlusIcon className="w-5 h-5 text-indigo-600 mr-2 flex-shrink-0" />
                <span className="text-gray-700">Additional Storage: ₹4,999/100GB/year</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// const AccountsModal = ({ isOpen, onClose }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [schools, setSchools] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (isOpen) {
//       fetchSchools();
//     }
//   }, [isOpen]);

//   const fetchSchools = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const token = localStorage.getItem('token');

//       if (!token) {
//         throw new Error('Authentication token not found. Please login.');
//       }

//       const response = await fetch('http://localhost:5000/api/v1/schools', {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         if (response.status === 401) {
//           throw new Error('Session expired. Please login again.');
//         } else if (response.status === 403) {
//           throw new Error('You do not have permission to view schools.');
//         }
//         throw new Error(`Failed to fetch schools: ${response.statusText}`);
//       }

//       const result = await response.json();

//       if (result.success && result.data) {
//         console.log('✅ Schools loaded:', result.data.length);
//         setSchools(result.data);
//       } else {
//         throw new Error('Invalid response format from server');
//       }
//     } catch (err) {
//       console.error('❌ Error fetching schools:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredSchools = schools.filter(school =>
//     school.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     school.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     school.owner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     school.address?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto pt-4 pb-4">
//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl relative my-4">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition bg-white rounded-full p-2 shadow-lg z-10"
//         >
//           <XMarkIcon className="w-6 h-6" />
//         </button>

//         <div className="p-6 sm:p-8 md:p-12">
//           <div className="mb-6 sm:mb-8">
//             <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
//               Client School Directory
//             </h2>
//             <p className="text-sm sm:text-base text-gray-600 mb-6">
//               Manage and monitor all active client accounts
//             </p>

//             <div className="relative">
//               <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder="Search by school name, email, owner, or address..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition"
//               />
//             </div>
//           </div>

//           {loading ? (
//             <div className="text-center py-12">
//               <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//               <p className="text-gray-600 mt-4">Loading schools...</p>
//             </div>
//           ) : error ? (
//             <div className="text-center py-12">
//               <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-4">
//                 <p className="text-red-600 font-semibold mb-2">Error loading schools</p>
//                 <p className="text-red-500 text-sm">{error}</p>
//               </div>
//               <button
//                 onClick={fetchSchools}
//                 className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
//               >
//                 Retry
//               </button>
//             </div>
//           ) : filteredSchools.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-gray-500 text-lg">
//                 {searchTerm ? 'No schools found matching your search.' : 'No schools registered yet.'}
//               </p>
//             </div>
//           ) : (
//             <>
//               <div className="mb-4 text-sm text-gray-600">
//                 Showing <strong>{filteredSchools.length}</strong> of <strong>{schools.length}</strong> schools
//               </div>

//               <div className="grid grid-cols-1 gap-4 sm:gap-6">
//                 {filteredSchools.map((school) => (
//                   <div
//                     key={school._id}
//                     className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition duration-300"
//                   >
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-3 mb-2 flex-wrap">
//                           <h3 className="text-lg sm:text-xl font-bold text-gray-900">{school.school_name}</h3>
//                           <span className={`px-3 py-1 rounded-full text-xs font-semibold ${school.isActive
//                               ? 'bg-green-100 text-green-700'
//                               : 'bg-yellow-100 text-yellow-700'
//                             }`}>
//                             {school.isActive ? 'Active' : 'Pending'}
//                           </span>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
//                           <div>
//                             <span className="font-semibold">ID:</span> {school._id.substring(0, 10)}...
//                           </div>
//                           {school.address && (
//                             <div>
//                               <span className="font-semibold">Location:</span> {school.address}
//                             </div>
//                           )}
//                           {school.totalStudents !== undefined && (
//                             <div>
//                               <span className="font-semibold">Students:</span> {school.totalStudents}
//                             </div>
//                           )}
//                           {school.subscriptionPlan && (
//                             <div>
//                               <span className="font-semibold">Plan:</span> <span className="text-indigo-600 font-semibold">{school.subscriptionPlan}</span>
//                             </div>
//                           )}
//                           <div>
//                             <span className="font-semibold">Owner:</span> {school.owner_name}
//                           </div>
//                           <div>
//                             <span className="font-semibold">Email:</span> {school.email}
//                           </div>
//                           {school.phone && (
//                             <div>
//                               <span className="font-semibold">Phone:</span> {school.phone}
//                             </div>
//                           )}
//                           <div>
//                             <span className="font-semibold">Joined:</span> {formatDate(school.createdAt)}
//                           </div>
//                         </div>
//                       </div>

//                       <button className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition duration-300">
//                         View Details
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

const SupportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto pt-4 pb-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl relative my-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-black-800 hover:text-gray-600 transition bg-red-100 rounded-full p-2 shadow-lg z-10"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <div className="p-6 sm:p-8 md:p-12">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Contact Support
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              We're here to help! Reach out to us through any of these channels
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border-2 border-indigo-200 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-full mb-4">
                <EnvelopeIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Email Us</h3>
              <a href="mailto:clustorix@gmail.com" className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm sm:text-base break-all">
                clustorix@gmail.com
              </a>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border-2 border-green-200 hover:shadow-lg transition duration-300">
              <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded-full mb-4">
                <PhoneIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Call Us</h3>
              <div className="space-y-1">
                <a href="tel:+918123090954" className="block text-green-600 hover:text-green-800 font-semibold text-sm sm:text-base">
                  +91 81230 90954
                </a>
                <a href="tel:+916362050541" className="block text-green-600 hover:text-green-800 font-semibold text-sm sm:text-base">
                  +91 63620 50541
                </a>
              </div>
            </div>
          </div>

          <div className="border-t-2 border-gray-200 pt-8 mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
              Connect With Us
            </h3>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              <a
                href="https://www.facebook.com/profile.php?id=61581763004694"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center w-24 sm:w-28 h-24 sm:h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-110 transition duration-300"
              >
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="text-white font-semibold text-xs">Facebook</span>
              </a>

              <a
                href="https://www.instagram.com/clustorix?igsh=YWJpcnU3bTI5cmJi"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center w-24 sm:w-28 h-24 sm:h-28 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-500 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-110 transition duration-300"
              >
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span className="text-white font-semibold text-xs">Instagram</span>
              </a>

              <a
                href="https://www.linkedin.com/company/clustorix"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center w-24 sm:w-28 h-24 sm:h-28 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-110 transition duration-300"
              >
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                <span className="text-white font-semibold text-xs">LinkedIn</span>
              </a>
            </div>
          </div>

          <div className="p-4 sm:p-6 bg-gray-50 rounded-2xl text-center">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Business Hours:</span> Monday - Saturday, 9:00 AM - 6:00 PM IST
            </p>
            <p className="text-xs text-gray-500 mt-2">
              We typically respond within 24 hours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">

      <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 via-black-700 to-purple-800 h-[60vh] z-0 rounded-bl-2xl rounded-br-2xl"></div>

      <header className="w-full p-4 md:p-6 flex justify-between items-center bg-white shadow-xl fixed top-0 z-10 border-b border-gray-200">
        <h1 className="text-lg md:text-2xl font-extrabold text-indigo-700 tracking-tight">
          Clustorix <span className="text-gray-500 font-medium">Portal</span>
        </h1>
        <button
          onClick={() => navigate('/login')}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm md:text-base font-semibold rounded-full shadow-md 
                      hover:bg-indigo-700 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Admin Login
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </button>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start px-4 text-center z-0 pt-28 md:pt-36 pb-16 max-w-full">

        <div className="max-w-6xl mx-auto mb-16 relative px-2 sm:px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 text-white leading-tight drop-shadow-lg max-w-full">
            Transforming <span className="text-yellow-300">Education Management</span> with Simplicity
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-indigo-200 max-w-full sm:max-w-3xl mx-auto mb-12 font-light px-4 sm:px-6">
            Your secure, centralized control panel for all Clustorix ERP and Academy systems, designed for speed and reliability.
          </p>
        </div>

        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-8 px-2 sm:px-4">
          <FeatureCard
            title="Subscription & Billing"
            description="Manage dynamic pricing, handle plan upgrades/downgrades, and view payment history for all client schools."
            icon={ScaleIcon}
            actionText="View Pricing Details"
            onClick={() => setIsPricingOpen(true)}
          />

          {/* <FeatureCard
            title="Client School Directory"
            description="Access a complete list of all active and pending client accounts, along with their assigned administrators and modules."
            icon={UsersIcon}
            actionText="Browse Accounts"
            onClick={() => setIsAccountsOpen(true)}
          /> */}

          <FeatureCard
            title="Service Desk Overview"
            description="Monitor real-time support ticket volume, track resolution times, and analyze common issues to improve service quality."
            icon={CheckCircleIcon}
            actionText="Contact Support"
            onClick={() => setIsSupportOpen(true)}
          />
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-black mt-auto rounded-t-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center items-center">
            <p className="text-sm text-white text-center">© {new Date().getFullYear()} Clustorix Admin Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      {/* <AccountsModal isOpen={isAccountsOpen} onClose={() => setIsAccountsOpen(false)} /> */}
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </div>
  );
};

export default LandingPage;