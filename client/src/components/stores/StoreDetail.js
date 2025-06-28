import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaTags, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StoreDetail = () => {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStore = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/stores/${id}`);
        setStore(res.data.store);
        setServices(res.data.services);
      } catch {
        setStore(null);
        setServices([]);
      }
      setLoading(false);
    };
    fetchStore();
  }, [id]);

  if (loading) return <div className="py-12"><LoadingSpinner skeleton size="lg" className="w-full h-40" /></div>;
  if (!store) return <div className="container py-12 text-center text-gray-500">Store not found.</div>;

  return (
    <div className="container py-8 min-h-screen">
      <motion.div className="max-w-4xl mx-auto" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold mb-2 text-blue-700 flex items-center gap-2">
          {store.logo ? (
            <img src={store.logo} alt="Store Logo" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <FaUserCircle className="w-8 h-8 text-gray-400" />
          )}
          {store.name}
        </h1>
        <div className="flex items-center gap-2 mb-4">
          <FaTags className="text-blue-400" />
          <span className="text-sm text-gray-500">{store.category}</span>
        </div>
        <p className="text-gray-700 mb-6">{store.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <motion.div className="card" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Store Information</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-400" />
                <span>Floor {store.location.floor}, Unit {store.location.unit}</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhone className="text-blue-400" />
                <span>{store.contact.phone}</span>
              </div>
              {store.contact.email && (
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-blue-400" />
                  <span>{store.contact.email}</span>
                </div>
              )}
            </div>
          </motion.div>
          <motion.div className="card" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Operating Hours</h2>
            <div className="space-y-2">
              {Object.entries(store.operatingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between">
                  <span className="capitalize">{day}</span>
                  <span>{hours.isOpen ? `${hours.open} - ${hours.close}` : 'Closed'}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div className="card" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Available Services</h2>
          {services.length === 0 ? (
            <p className="text-gray-500">No services available at this store.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service, idx) => (
                <motion.div
                  key={service._id}
                  className="border rounded-lg p-4 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-white/90 backdrop-blur"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="font-semibold text-blue-700 mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-600">${service.price.toFixed(2)}</span>
                    <Link to={`/book/${service._id}`} className="btn btn-primary text-sm">Book Now</Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        <div className="mt-6 text-center">
          <Link to="/stores" className="btn btn-outline">Back to Stores</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default StoreDetail; 