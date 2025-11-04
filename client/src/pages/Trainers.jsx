import { useState } from 'react';
import { Search, Plus, MoreVertical, Mail, Phone, MapPin, Edit, Trash2, Star } from 'lucide-react';

const Trainers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Sample trainers data
  const trainers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.j@clustorix.com',
      phone: '+91 98765 43210',
      location: 'Mumbai, Maharashtra',
      expertise: ['Robotics', 'AI', 'IoT'],
      schools: 12,
      rating: 4.8,
      status: 'active',
      avatar: 'SJ'
    },
    {
      id: 2,
      name: 'Rahul Sharma',
      email: 'rahul.s@clustorix.com',
      phone: '+91 98765 43211',
      location: 'Bangalore, Karnataka',
      expertise: ['Python', 'Machine Learning', '3D Printing'],
      schools: 8,
      rating: 4.9,
      status: 'active',
      avatar: 'RS'
    },
    {
      id: 3,
      name: 'Priya Patel',
      email: 'priya.p@clustorix.com',
      phone: '+91 98765 43212',
      location: 'Delhi, NCR',
      expertise: ['Coding', 'Game Development', 'App Development'],
      schools: 15,
      rating: 4.7,
      status: 'active',
      avatar: 'PP'
    },
    {
      id: 4,
      name: 'Michael Chen',
      email: 'michael.c@clustorix.com',
      phone: '+91 98765 43213',
      location: 'Pune, Maharashtra',
      expertise: ['Electronics', 'Arduino', 'Raspberry Pi'],
      schools: 6,
      rating: 4.6,
      status: 'inactive',
      avatar: 'MC'
    },
  ];

  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trainer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-700' 
      : 'bg-gray-100 text-gray-700';
  };

  const getAvatarColor = (index) => {
    const colors = [
      'bg-gradient-to-br from-purple-500 to-pink-500',
      'bg-gradient-to-br from-blue-500 to-cyan-500',
      'bg-gradient-to-br from-orange-500 to-red-500',
      'bg-gradient-to-br from-green-500 to-teal-500',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Trainers Management</h1>
        <p className="text-gray-600">Manage and monitor your training team</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Trainers</p>
              <p className="text-2xl font-bold text-gray-800">{trainers.length}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👨‍🏫</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Trainers</p>
              <p className="text-2xl font-bold text-green-600">
                {trainers.filter(t => t.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Schools Covered</p>
              <p className="text-2xl font-bold text-blue-600">
                {trainers.reduce((sum, t) => sum + t.schools, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🏫</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
              <p className="text-2xl font-bold text-yellow-600">
                {(trainers.reduce((sum, t) => sum + t.rating, 0) / trainers.length).toFixed(1)}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search trainers by name, email, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Trainer
          </button>
        </div>
      </div>

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainers.map((trainer, index) => (
          <div key={trainer.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
            {/* Card Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-14 h-14 rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                    {trainer.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">{trainer.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">{trainer.rating}</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Status Badge */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(trainer.status)}`}>
                {trainer.status === 'active' ? '● Active' : '○ Inactive'}
              </span>

              {/* Contact Info */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{trainer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{trainer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{trainer.location}</span>
                </div>
              </div>

              {/* Expertise Tags */}
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {trainer.expertise.map((skill, idx) => (
                    <span key={idx} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Schools Count */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Assigned Schools</span>
                  <span className="text-sm font-semibold text-indigo-600">{trainer.schools} Schools</span>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-end gap-2 border-t border-gray-100">
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition">
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTrainers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No trainers found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}

      {/* Add Trainer Modal (Simple Placeholder) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add New Trainer</h2>
            <p className="text-gray-600 mb-4">Form implementation coming soon...</p>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trainers;