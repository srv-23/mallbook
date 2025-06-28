import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaCalendar, FaClock, FaStore, FaDollarSign, FaTimes } from 'react-icons/fa';

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
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">My Bookings at kmall</h1>
      {bookings.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">No bookings found.</div>
      ) : (
        <div className="space-y-4">
          {bookings.map(booking => (
            <div key={booking._id} className="card">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-blue-700 mb-2">{booking.service?.name}</h2>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FaStore />
                      <span>{booking.store?.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaCalendar />
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaClock />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaDollarSign />
                      <span>${booking.totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  {booking.specialRequests && (
                    <p className="text-sm text-gray-500 mt-2">Special requests: {booking.specialRequests}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${getStatusBadge(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="btn btn-danger text-sm"
                    >
                      <FaTimes />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings; 