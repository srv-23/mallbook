import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaCalendar, FaClock, FaStore, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { priceDisplay } from '../../utils/currency';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/api/bookings');
        setBookings(res.data);
      } catch {
        setBookings([]);
      }
      setLoading(false);
    };
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await axios.put(`/api/bookings/${bookingId}/cancel`);
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'badge-warning',
      confirmed: 'badge-info',
      completed: 'badge-success',
      cancelled: 'badge-danger'
    };
    return badges[status] || 'badge-secondary';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container py-8 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold mb-2 text-blue-700 text-center">My Bookings at MallBook</h1>
        <p className="text-gray-600 text-center mb-8">Manage and track all your bookings</p>
      </motion.div>

      {bookings.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-500 mt-12 py-12">
          <FaCalendar className="text-6xl mx-auto mb-4 text-gray-300" />
          <p className="text-xl">No bookings found. Start booking services now!</p>
        </motion.div>
      ) : (
        <motion.div
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {bookings.map((booking, idx) => (
            <motion.div
              key={booking._id}
              className="card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-blue-700 mb-3">{booking.service?.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaStore className="text-blue-400" />
                      <span className="font-medium">{booking.store?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendar className="text-blue-400" />
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaClock className="text-blue-400" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 font-bold text-green-600">
                      {priceDisplay(booking.totalPrice || 0)}
                    </div>
                  </div>
                  {booking.specialRequests && (
                    <p className="text-sm text-gray-500 mt-3 italic">Note: {booking.specialRequests}</p>
                  )}
                </div>
                <div className="flex flex-col items-center gap-2 md:ml-4">
                  <span className={`badge ${getStatusBadge(booking.status)} text-center`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="btn btn-danger text-sm w-full flex items-center justify-center gap-2"
                    >
                      <FaTimes /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MyBookings; 