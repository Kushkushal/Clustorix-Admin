import { useState } from 'react';
import { Search, Filter, Download, TrendingUp, Users, DollarSign, Calendar, Check, X, AlertCircle } from 'lucide-react';

const Subscription = () => {
  const [selectedTab, setSelectedTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample subscription data
  const subscriptions = [
    {
      id: 1,
      schoolName: 'Delhi Public School',
      plan: 'Premium',
      price: 50000,
      students: 500,
      startDate: '2024-01-15',
      endDate: '2025-01-14',
      status: 'active',
      daysLeft: 45,
      features: ['All Modules', 'Priority Support', 'Custom Workshops'],
      paymentStatus: 'paid'
    },
    {
      id: 2,
      schoolName: 'Ryan International School',
      plan: 'Standard',
      price: 30000,
      students: 300,
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      status: 'active',
      daysLeft: 120,
      features: ['Basic Modules', 'Email Support'],
      paymentStatus: 'paid'
    },
    {
      id: 3,
      schoolName: 'Modern School',
      plan: 'Premium',
      price: 50000,
      students: 450,
      startDate: '2023-12-01',
      endDate: '2024-11-30',
      status: 'expiring',
      daysLeft: 5,
      features: ['All Modules', 'Priority Support', 'Custom Workshops'],
      paymentStatus: 'paid'
    },
    {
      id: 4,
      schoolName: 'St. Mary\'s School',
      plan: 'Basic',
      price: 15000,
      students: 150,
      startDate: '2024-02-01',
      endDate: '2024-10-15',
      status: 'expired',
      daysLeft: -20,
      features: ['Basic Modules'],
      paymentStatus: 'pending'
    },
  ];

  const plans = [
    {
      name: 'Basic',
      price: 15000,
      color: 'from-gray-500 to-gray-600',
      icon: '📚',
      features: ['Up to 200 students', 'Basic modules', 'Email support', '6 months validity']
    },
    {
      name: 'Standard',
      price: 30000,
      color: 'from-blue-500 to-blue-600',
      icon: '🎓',
      features: ['Up to 400 students', 'All modules', 'Priority email support', '12 months validity']
    },
    {
      name: 'Premium',
      price: 50000,
      color: 'from-purple-500 to-pink-500',
      icon: '👑',
      features: ['Unlimited students', 'All modules + extras', 'Priority support', 'Custom workshops', '12 months validity']
    },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      active: { color: 'bg-green-100 text-green-700 border-green-200', icon: Check, label: 'Active' },
      expiring: { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: AlertCircle, label: 'Expiring Soon' },
      expired: { color: 'bg-red-100 text-red-700 border-red-200', icon: X, label: 'Expired' }
    };
    return configs[status] || configs.active;
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = sub.schoolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sub.plan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === 'all' || sub.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    totalRevenue: subscriptions.reduce((sum, sub) => sum + (sub.paymentStatus === 'paid' ? sub.price : 0), 0),
    activeSubscriptions: subscriptions.filter(s => s.status === 'active').length,
    expiringThisMonth: subscriptions.filter(s => s.status === 'expiring').length,
    totalStudents: subscriptions.reduce((sum, sub) => sum + sub.students, 0)
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Subscription Management</h1>
        <p className="text-gray-600">Monitor and manage school subscriptions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-sm opacity-90 mb-1">Total Revenue</p>
          <p className="text-2xl font-bold">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Check className="w-8 h-8 opacity-80" />
            <span className="text-xs opacity-60 bg-white/20 px-2 py-1 rounded-full">Active</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Active Plans</p>
          <p className="text-2xl font-bold">{stats.activeSubscriptions}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-8 h-8 opacity-80" />
            <Calendar className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-sm opacity-90 mb-1">Expiring Soon</p>
          <p className="text-2xl font-bold">{stats.expiringThisMonth}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-xs opacity-60 bg-white/20 px-2 py-1 rounded-full">Total</span>
          </div>
          <p className="text-sm opacity-90 mb-1">Students Covered</p>
          <p className="text-2xl font-bold">{stats.totalStudents}</p>
        </div>
      </div>

      {/* Plans Overview */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <div className={`bg-gradient-to-r ${plan.color} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">Plan</p>
                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                  </div>
                  <span className="text-4xl">{plan.icon}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-800">₹{(plan.price / 1000).toFixed(0)}K</span>
                  <span className="text-gray-500 text-sm">/year</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Tabs */}
          <div className="flex gap-2">
            {['all', 'active', 'expiring', 'expired'].map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search schools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">School</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Students</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Validity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSubscriptions.map((sub) => {
                const statusConfig = getStatusConfig(sub.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <tr key={sub.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{sub.schoolName}</p>
                        <p className="text-sm text-gray-500">{sub.features.length} features</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                        {sub.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-700">{sub.students}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">₹{sub.price.toLocaleString()}</p>
                      <p className={`text-xs ${sub.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                        {sub.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-gray-600">{new Date(sub.startDate).toLocaleDateString()} - {new Date(sub.endDate).toLocaleDateString()}</p>
                        <p className={`text-xs font-medium ${sub.daysLeft > 30 ? 'text-green-600' : sub.daysLeft > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {sub.daysLeft > 0 ? `${sub.daysLeft} days left` : `Expired ${Math.abs(sub.daysLeft)} days ago`}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredSubscriptions.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl mt-6">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No subscriptions found</h3>
          <p className="text-gray-600">Try adjusting your filters or search criteria</p>
        </div>
      )}
    </div>
  );
};

export default Subscription;