import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaSearch, FaStore, FaTags, FaUserCircle, FaFilter, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { priceDisplay } from '../../utils/currency';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/services/categories');
        setCategories(res.data);
      } catch {}
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;
        const res = await axios.get('/api/services', { params });
        setServices(res.data);
      } catch {
        setServices([]);
        toast.error('Failed to fetch services.');
      }
      setLoading(false);
    };
    fetchServices();
  }, [search, category]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-indigo-700 mb-2">
            Book a Service at MallBook
          </h1>
          <p className="text-gray-600 text-lg">Premium services at your favorite mall stores</p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-10"
        >
          <div className="flex items-center gap-2 mb-6">
            <FaFilter className="text-blue-600 text-xl" />
            <h2 className="text-xl font-bold text-gray-800">Filter Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Services</label>
              <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-2 bg-white hover:border-blue-500 transition-colors">
                <FaSearch className="text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Type service name..."
                  className="border-0 focus:ring-0 w-full bg-transparent"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <select
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-0 bg-white"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-lg p-6 h-80 animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-12 bg-gray-200 rounded mb-3"></div>
                <div className="h-20 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <FaTags className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl font-semibold">No services found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08, delayChildren: 0.1 },
              },
            }}
          >
            {services.map((service, idx) => (
              <motion.div
                key={service._id}
                className="group bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -5 }}
              >
                {/* Service Header */}
                <div className="relative h-28 bg-gradient-to-r from-green-500 to-emerald-600 overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{
                      backgroundImage: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
                      backgroundSize: '40px 40px',
                    }}></div>
                  </div>
                </div>

                {/* Service Content */}
                <div className="p-5">
                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      <FaTags className="text-xs" />
                      {service.category}
                    </span>
                  </div>

                  {/* Service Title */}
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
                    {service.description}
                  </p>

                  {/* Store Info */}
                  <div className="flex items-center gap-2 mb-4 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                    {service.store?.logo ? (
                      <img
                        src={service.store.logo}
                        alt="Store"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    )}
                    <span className="truncate font-semibold">{service.store?.name || 'Store'}</span>
                  </div>

                  {/* Duration & Price */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaClock className="text-blue-600" />
                      <span className="text-sm font-semibold">{service.duration} min</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {priceDisplay(service.price)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Link
                      to={`/services/${service._id}`}
                      className="block text-center py-2 px-4 bg-blue-100 text-blue-600 font-semibold rounded-lg hover:bg-blue-200 transition-all"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/book/${service._id}`}
                      className="block text-center py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 transition-all"
                    >
                      Book Now →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Services; 