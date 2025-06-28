import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaSearch, FaStore, FaTags, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

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
    <div className="container py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Book a Service at MallBook</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
        <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-full md:w-1/3">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search services..."
            className="form-input border-0 focus:ring-0 w-full"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="form-input w-full md:w-1/4"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <LoadingSpinner key={i} skeleton size="lg" className="w-full h-40" />
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">No services found.</div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {services.map((service, idx) => (
            <motion.div
              key={service._id}
              className="card flex flex-col h-full shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white/90 backdrop-blur"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FaTags className="text-blue-400" />
                  <span className="text-sm text-gray-500">{service.category}</span>
                </div>
                <h2 className="text-xl font-semibold mb-1 text-blue-700">{service.name}</h2>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{service.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {service.store?.logo ? (
                    <img src={service.store.logo} alt="Store Logo" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <FaUserCircle className="w-6 h-6 text-gray-400" />
                  )}
                  <FaStore />
                  <span>{service.store?.name || 'Store'}</span>
                </div>
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg text-blue-600">${service.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500">{service.duration} min</span>
                </div>
                <Link to={`/services/${service._id}`} className="btn btn-outline w-full">View Details</Link>
                <Link to={`/book/${service._id}`} className="btn btn-primary w-full">Book Now</Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Services; 