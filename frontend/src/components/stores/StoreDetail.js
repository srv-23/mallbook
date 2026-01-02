import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaTags, FaUserCircle, FaArrowLeft, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { priceDisplay } from '../../utils/currency';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Link
            to="/stores"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition-all hover:translate-x-[-4px] font-semibold text-gray-700"
          >
            <FaArrowLeft /> Back to Stores
          </Link>
        </motion.div>

        {/* Store Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-xl overflow-hidden mb-8"
        >
          {/* Header Background */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-32 relative">
            {store.logo && (
              <img
                src={store.logo}
                alt="Store Logo"
                className="absolute bottom-0 left-6 w-24 h-24 rounded-lg border-4 border-white object-cover"
              />
            )}
          </div>

          {/* Store Info */}
          <div className="p-8 pt-16">
            <h1 className="text-4xl font-bold text-gray-800 mb-3 flex items-center gap-3">
              {!store.logo && <FaUserCircle className="text-gray-400 text-3xl" />}
              {store.name}
            </h1>
            <div className="flex flex-wrap gap-3 mb-4">
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                <FaTags className="inline mr-2" />
                {store.category}
              </span>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">{store.description}</p>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Store Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Store Information</h2>
            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FaMapMarkerAlt className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Location</p>
                  <p className="text-gray-800 font-bold">
                    Floor {store.location.floor === '0' ? 'Ground' : store.location.floor === '1' ? 'First' : 'Second'}, Unit {store.location.unit}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FaPhone className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Phone</p>
                  <p className="text-gray-800 font-bold">{store.contact.phone}</p>
                </div>
              </div>

              {/* Email */}
              {store.contact.email && (
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <FaEnvelope className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Email</p>
                    <p className="text-gray-800 font-bold">{store.contact.email}</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Operating Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-lg p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaClock className="text-orange-600" />
              Operating Hours
            </h2>
            <div className="space-y-3">
              {Object.entries(store.operatingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-b-0">
                  <span className="capitalize font-semibold text-gray-700">{day}</span>
                  <span className={hours.isOpen ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    {hours.isOpen ? `${hours.open} - ${hours.close}` : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8 border-2 border-blue-200"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Store Stats</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-gray-600 text-sm font-semibold">Available Services</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{services.length}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">
                <p className="text-gray-600 text-sm font-semibold">Category</p>
                <p className="text-lg font-bold text-indigo-600 mt-2">{store.category}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Available Services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Available Services</h2>
          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No services available at this store.</p>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
              }}
            >
              {services.map((service, idx) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-blue-300 transition-all"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-300">
                    <span className="text-2xl font-bold text-green-600">{priceDisplay(service.price)}</span>
                    <span className="text-xs bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-semibold">
                      {service.duration} min
                    </span>
                  </div>
                  <Link
                    to={`/book/${service._id}`}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all text-center block"
                  >
                    Book Now →
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default StoreDetail; 