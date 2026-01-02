import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaUser, FaCalendarCheck, FaStore, FaSignOutAlt, FaEdit, FaBell } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { priceDisplay } from '../../utils/currency';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/bookings');
        setBookings(res.data.slice(0, 5));
      } catch {
        setBookings([]);
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  if (!user) return <LoadingSpinner />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-indigo-700 mb-2">
            Welcome, {user.name}! 👋
          </h1>
          <p className="text-gray-600 text-lg">Manage your bookings and explore MallBook services</p>
        </motion.div>

        {/* Quick Action Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          {/* Profile Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-600 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaUser className="text-2xl text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Your Profile</h2>
            </div>
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Phone:</span> {user.phone || 'Not added'}
              </p>
            </div>
            <button
              onClick={logout}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center gap-2"
            >
              <FaSignOutAlt /> Logout
            </button>
          </motion.div>

          {/* Bookings Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-600 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaCalendarCheck className="text-2xl text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">My Bookings</h2>
            </div>
            <p className="text-gray-600 mb-4">View and manage all your bookings</p>
            <Link
              to="/bookings"
              className="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all text-center"
            >
              View All Bookings →
            </Link>
          </motion.div>

          {/* Explore Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-purple-600 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FaStore className="text-2xl text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Explore</h2>
            </div>
            <p className="text-gray-600 mb-4">Discover services and stores</p>
            <div className="space-y-2">
              <Link
                to="/services"
                className="block w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all text-center"
              >
                Browse Services
              </Link>
              <Link
                to="/stores"
                className="block w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-indigo-600 hover:to-indigo-700 transition-all text-center"
              >
                Find Stores
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Recent Bookings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaBell className="text-xl text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Recent Bookings</h2>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <FaCalendarCheck className="text-5xl text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">No bookings yet. Start exploring MallBook!</p>
              <Link to="/services" className="inline-block mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-all">
                Book a Service Now
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {booking.service?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      at <span className="font-semibold text-blue-600">{booking.store?.name}</span>
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {new Date(booking.date).toLocaleDateString()} at {booking.time}
                    </span>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {priceDisplay(booking.totalPrice)}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-700'
                            : booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard; 