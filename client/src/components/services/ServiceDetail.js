import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaStore, FaTags, FaClock, FaUsers } from 'react-icons/fa';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/services/${id}`);
        setService(res.data);
      } catch {
        setService(null);
      }
      setLoading(false);
    };
    fetchService();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!service) return <div className="container py-12 text-center text-gray-500">Service not found.</div>;

  return (
    <div className="container py-8 min-h-screen">
      <div className="max-w-2xl mx-auto card">
        <h1 className="text-2xl font-bold mb-2 text-blue-700">{service.name}</h1>
        <div className="flex items-center gap-2 mb-2">
          <FaTags className="text-blue-400" />
          <span className="text-sm text-gray-500">{service.category}</span>
        </div>
        <p className="text-gray-700 mb-4">{service.description}</p>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaStore />
            <span>{service.store?.name || 'Store'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaClock />
            <span>{service.duration} min</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FaUsers />
            <span>Capacity: {service.capacity}</span>
          </div>
        </div>
        <div className="mb-4">
          <span className="font-bold text-xl text-blue-600">${service.price.toFixed(2)}</span>
        </div>
        <Link to={`/book/${service._id}`} className="btn btn-primary w-full mb-2">Book This Service</Link>
        <Link to="/services" className="btn btn-outline w-full">Back to Services</Link>
      </div>
    </div>
  );
};

export default ServiceDetail; 