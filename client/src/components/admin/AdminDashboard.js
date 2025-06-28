import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaUsers, FaStore, FaTags, FaCalendarCheck, FaDollarSign } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

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

  return (
    <div className="container py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">kmall Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card flex flex-col items-center">
          <FaUsers className="text-3xl text-blue-600 mb-2" />
          <div className="text-2xl font-bold">{stats.totals.users}</div>
          <div className="text-gray-600">Users</div>
        </div>
        <div className="card flex flex-col items-center">
          <FaStore className="text-3xl text-blue-600 mb-2" />
          <div className="text-2xl font-bold">{stats.totals.stores}</div>
          <div className="text-gray-600">Stores</div>
        </div>
        <div className="card flex flex-col items-center">
          <FaTags className="text-3xl text-blue-600 mb-2" />
          <div className="text-2xl font-bold">{stats.totals.services}</div>
          <div className="text-gray-600">Services</div>
        </div>
        <div className="card flex flex-col items-center">
          <FaCalendarCheck className="text-3xl text-blue-600 mb-2" />
          <div className="text-2xl font-bold">{stats.totals.bookings}</div>
          <div className="text-gray-600">Bookings</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">Booking Status Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.bookingStatuses}
                dataKey="count"
                nameKey="_id"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {stats.bookingStatuses.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h2 className="text-lg font-semibold mb-4 text-blue-700">Top Services</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.topServices} layout="vertical">
              <XAxis type="number" allowDecimals={false} />
              <YAxis dataKey="_id.name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="bookings" fill="#3b82f6" name="Bookings" />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card mb-8">
        <h2 className="text-lg font-semibold mb-4 text-blue-700">Recent Bookings</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="px-4 py-2 text-left">User</th>
                <th className="px-4 py-2 text-left">Service</th>
                <th className="px-4 py-2 text-left">Store</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Time</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.map(b => (
                <tr key={b._id} className="border-b last:border-b-0">
                  <td className="px-4 py-2">{b.user?.name}</td>
                  <td className="px-4 py-2">{b.service?.name}</td>
                  <td className="px-4 py-2">{b.store?.name}</td>
                  <td className="px-4 py-2">{new Date(b.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{b.time}</td>
                  <td className="px-4 py-2">
                    <span className="badge badge-info">{b.status}</span>
                  </td>
                  <td className="px-4 py-2">${b.totalPrice?.toFixed(2) || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="card text-center">
          <h3 className="font-semibold text-blue-700 mb-2">Today's Revenue</h3>
          <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
            <FaDollarSign /> ${stats.today.revenue.toFixed(2)}
          </div>
        </div>
        <div className="card text-center">
          <h3 className="font-semibold text-blue-700 mb-2">This Week's Revenue</h3>
          <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
            <FaDollarSign /> ${stats.week.revenue.toFixed(2)}
          </div>
        </div>
        <div className="card text-center">
          <h3 className="font-semibold text-blue-700 mb-2">This Month's Revenue</h3>
          <div className="text-2xl font-bold text-green-600 flex items-center justify-center gap-2">
            <FaDollarSign /> ${stats.month.revenue.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 