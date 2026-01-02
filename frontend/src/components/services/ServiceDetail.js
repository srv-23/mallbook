import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaStore, FaTags, FaClock, FaUsers, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { priceDisplay } from '../../utils/currency';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all hover:translate-x-[-4px] font-semibold text-gray-700"
          >
            <FaArrowLeft /> Back to Services
          </Link>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{service.name}</h1>
            <div className="flex items-center gap-3">
              <div className="bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2">
                <FaTags className="text-lg" />
                <span className="font-semibold">{service.category}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-3">About This Service</h2>
              <p className="text-gray-700 text-lg leading-relaxed">{service.description}</p>
            </motion.div>

            {/* Service Details Grid */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            >
              {/* Store Info */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-500 text-white p-3 rounded-lg">
                    <FaStore className="text-xl" />
                  </div>
                  <h3 className="font-bold text-gray-800">Store</h3>
                </div>
                <p className="text-lg font-semibold text-blue-600">{service.store?.name || 'Store'}</p>
              </div>

              {/* Duration */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-500 text-white p-3 rounded-lg">
                    <FaClock className="text-xl" />
                  </div>
                  <h3 className="font-bold text-gray-800">Duration</h3>
                </div>
                <p className="text-lg font-semibold text-purple-600">{service.duration} minutes</p>
              </div>

              {/* Capacity */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-500 text-white p-3 rounded-lg">
                    <FaUsers className="text-xl" />
                  </div>
                  <h3 className="font-bold text-gray-800">Capacity</h3>
                </div>
                <p className="text-lg font-semibold text-orange-600">{service.capacity} people</p>
              </div>
            </motion.div>

            {/* Price Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 border-2 border-green-200 mb-8"
            >
              <p className="text-gray-600 text-sm font-semibold mb-2">Service Price</p>
              <p className="text-5xl font-bold text-green-600">{priceDisplay(service.price)}</p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col md:flex-row gap-4"
            >
              <Link
                to={`/book/${service._id}`}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-center transform hover:scale-105"
              >
                Book This Service Now
              </Link>
              <Link
                to={`/stores/${service.store?._id}`}
                className="flex-1 bg-blue-100 text-blue-600 font-bold py-4 px-6 rounded-lg hover:bg-blue-200 transition-all text-center"
              >
                View Store Details
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceDetail; 