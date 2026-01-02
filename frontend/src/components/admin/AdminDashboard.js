import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaUsers, FaStore, FaTags, FaCalendarCheck, FaChartLine, FaArrowUp } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { priceDisplay } from '../../utils/currency';

const COLORS = ['#3b82f6', '#10b981', '#f59e42', '#ef4444', '#6366f1', '#fbbf24', '#14b8a6'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/admin/dashboard');
        setStats(res.data);
      } catch {
        setStats(null);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading || !stats) return <LoadingSpinner />;

  const statCards = [
    { icon: FaUsers, label: 'Users', value: stats.totals.users, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-100' },
    { icon: FaStore, label: 'Stores', value: stats.totals.stores, color: 'from-green-500 to-green-600', bgColor: 'bg-green-100' },
    { icon: FaTags, label: 'Services', value: stats.totals.services, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-100' },
    { icon: FaCalendarCheck, label: 'Bookings', value: stats.totals.bookings, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-100' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-indigo-700 mb-2">
            MallBook Admin Dashboard
          </h1>
          <p className="text-gray-600 text-lg">Monitor platform performance and analytics</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`text-2xl text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`} />
                  </div>
                </div>
                <p className="text-gray-600 text-sm font-semibold">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10"
        >
          {/* Booking Status */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaChartLine className="text-blue-600" />
              Booking Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.bookingStatuses}
                  dataKey="count"
                  nameKey="_id"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={{ fill: '#374151', fontSize: 12 }}
                >
                  {stats.bookingStatuses.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={(value) => `${value} bookings`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Services */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaArrowUp className="text-green-600" />
              Top Services
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topServices} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="_id.name" type="category" width={100} fontSize={12} />
                <Tooltip formatter={(value) => value} />
                <Bar dataKey="bookings" fill="#3b82f6" name="Bookings" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Revenue Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {[
            { label: "Today's Revenue", revenue: stats.today.revenue, icon: '📅', color: 'from-blue-500 to-blue-600' },
            { label: "This Week's Revenue", revenue: stats.week.revenue, icon: '📊', color: 'from-green-500 to-green-600' },
            { label: "This Month's Revenue", revenue: stats.month.revenue, icon: '📈', color: 'from-purple-500 to-purple-600' },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className={`bg-gradient-to-br ${card.color} rounded-lg shadow-lg p-6 text-white`}
            >
              <div className="text-3xl mb-2">{card.icon}</div>
              <p className="text-blue-100 font-semibold mb-1">{card.label}</p>
              <p className="text-3xl font-bold">{priceDisplay(card.revenue)}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Bookings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b-2 border-gray-200">
                  <th className="px-4 py-3 text-left font-bold text-gray-700">User</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Service</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Store</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Time</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left font-bold text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentBookings.map((b, idx) => (
                  <motion.tr
                    key={b._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-semibold text-gray-800">{b.user?.name}</td>
                    <td className="px-4 py-3 text-gray-700">{b.service?.name}</td>
                    <td className="px-4 py-3 text-gray-700">{b.store?.name}</td>
                    <td className="px-4 py-3 text-gray-600">{new Date(b.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-gray-600">{b.time}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          b.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : b.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-green-600">{priceDisplay(b.totalPrice || 0)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard; 