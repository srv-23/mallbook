import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaClock, FaUsers, FaDollarSign } from 'react-icons/fa';

const BookingForm = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    date: '',
    time: '',
    numberOfPeople: 1,
    specialRequests: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/services/${serviceId}`);
        setService(res.data);
      } catch {
        setService(null);
      }
      setLoading(false);
    };
    fetchService();
  }, [serviceId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await axios.post('/api/bookings', {
        serviceId,
        ...form
      });
      navigate('/bookings');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    }
    setSubmitting(false);
  };

  if (loading) return <LoadingSpinner />;
  if (!service) return <div className="container py-12 text-center text-gray-500">Service not found.</div>;

  return (
    <div className="container py-8 min-h-screen">
      <div className="max-w-2xl mx-auto card">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">Book {service.name}</h1>
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold mb-2">Service Details</h2>
          <div className="flex items-center gap-2 mb-1">
            <FaDollarSign className="text-blue-400" />
            <span className="font-bold text-lg text-blue-600">${service.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <FaClock className="text-blue-400" />
            <span>{service.duration} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <FaUsers className="text-blue-400" />
            <span>Capacity: {service.capacity} people</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              className="form-input"
              value={form.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Time</label>
            <input
              type="time"
              name="time"
              className="form-input"
              value={form.time}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Number of People</label>
            <input
              type="number"
              name="numberOfPeople"
              className="form-input"
              value={form.numberOfPeople}
              onChange={handleChange}
              required
              min={1}
              max={service.capacity}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Special Requests (Optional)</label>
            <textarea
              name="specialRequests"
              className="form-input"
              value={form.specialRequests}
              onChange={handleChange}
              rows={3}
            />
          </div>
          {error && <div className="form-error text-center">{error}</div>}
          <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
            {submitting ? <LoadingSpinner size="sm" /> : 'Confirm Booking'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm; 