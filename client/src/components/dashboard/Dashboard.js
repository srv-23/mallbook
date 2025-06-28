import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaUser, FaCalendarCheck, FaStore, FaSignOutAlt } from 'react-icons/fa';

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

  return (
    <div className="container py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Welcome, {user.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="card flex flex-col items-center">
          <FaUser className="text-3xl text-blue-600 mb-2" />
          <h2 className="font-semibold text-lg mb-1">Profile</h2>
          <div className="text-gray-700 text-sm mb-2">{user.email}</div>
          <div className="text-gray-700 text-sm mb-2">{user.phone}</div>
          <button onClick={logout} className="btn btn-danger w-full mt-2 flex items-center justify-center gap-2">
            <FaSignOutAlt /> Logout
          </button>
        </div>
        <div className="card flex flex-col items-center">
          <FaCalendarCheck className="text-3xl text-blue-600 mb-2" />
          <h2 className="font-semibold text-lg mb-1">My Bookings</h2>
          <Link to="/bookings" className="btn btn-primary w-full mt-2">View All Bookings</Link>
        </div>
        <div className="card flex flex-col items-center">
          <FaStore className="text-3xl text-blue-600 mb-2" />
          <h2 className="font-semibold text-lg mb-1">Explore</h2>
          <Link to="/services" className="btn btn-outline w-full mt-2">Book a Service</Link>
          <Link to="/stores" className="btn btn-outline w-full mt-2">Find a Store</Link>
        </div>
      </div>
      <div className="card mt-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">Recent Bookings</h2>
        {loading ? (
          <LoadingSpinner />
        ) : bookings.length === 0 ? (
          <div className="text-gray-500">No recent bookings.</div>
        ) : (
          <div className="space-y-2">
            {bookings.map(booking => (
              <div key={booking._id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b pb-2 last:border-b-0 last:pb-0">
                <div>
                  <span className="font-semibold text-blue-700">{booking.service?.name}</span> at <span className="text-gray-700">{booking.store?.name}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {new Date(booking.date).toLocaleDateString()} {booking.time} — <span className="badge badge-info">{booking.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 