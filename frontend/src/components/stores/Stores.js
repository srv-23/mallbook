import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaSearch, FaMapMarkerAlt, FaPhone, FaUserCircle, FaFilter } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [floor, setFloor] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, floorsRes] = await Promise.all([
          axios.get('/api/stores/categories'),
          axios.get('/api/stores/floors')
        ]);
        setCategories(categoriesRes.data);
        setFloors(floorsRes.data);
      } catch {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchStores = async () => {
      setLoading(true);
      try {
        const params = {};
        if (search) params.search = search;
        if (category) params.category = category;
        if (floor) params.floor = floor;
        const res = await axios.get('/api/stores', { params });
        setStores(res.data);
      } catch {
        setStores([]);
        toast.error('Failed to fetch stores.');
      }
      setLoading(false);
    };
    fetchStores();
  }, [search, category, floor]);

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
            Explore Stores at MallBook
          </h1>
          <p className="text-gray-600 text-lg">Discover your favorite shopping destinations</p>
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
            <h2 className="text-xl font-bold text-gray-800">Filter Stores</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Stores</label>
              <div className="flex items-center border-2 border-gray-300 rounded-lg px-4 py-2 bg-white hover:border-blue-500 transition-colors">
                <FaSearch className="text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Type store name..."
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

            {/* Floor */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Floor</label>
              <select
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-0 bg-white"
                value={floor}
                onChange={e => setFloor(e.target.value)}
              >
                <option value="">All Floors</option>
                {floors.map(f => {
                  const floorNum = typeof f === 'string' ? parseInt(f) : f;
                  let floorLabel = '';
                  if (floorNum === 0) floorLabel = 'Ground Floor (0)';
                  else if (floorNum === 1) floorLabel = 'First Floor (1)';
                  else if (floorNum === 2) floorLabel = 'Second Floor (2)';
                  return (
                    <option key={f} value={f}>
                      {floorLabel}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Stores Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-lg p-6 h-64 animate-pulse"
              >
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-12 bg-gray-200 rounded mb-3"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
              </div>
            ))}
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-16">
            <FaUserCircle className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-xl font-semibold">No stores found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
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
            {stores.map((store, idx) => (
              <motion.div
                key={store._id}
                className="group bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -5 }}
              >
                {/* Store Header with Color Bar */}
                <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-lg overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full" style={{
                      backgroundImage: `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)`,
                      backgroundSize: '40px 40px',
                    }}></div>
                  </div>
                  {store.logo && (
                    <img
                      src={store.logo}
                      alt="Store Logo"
                      className="w-12 h-12 rounded-full object-cover border-4 border-white absolute top-2 right-3"
                    />
                  )}
                </div>

                {/* Store Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                    {store.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 h-10">
                    {store.description}
                  </p>

                  {/* Location Info */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaMapMarkerAlt className="text-blue-600 flex-shrink-0" />
                      <span>
                        Floor {store.location.floor === '0' ? 'Ground' : store.location.floor === '1' ? 'First' : 'Second'}, Unit {store.location.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <FaPhone className="text-green-600 flex-shrink-0" />
                      <span className="hover:text-green-600 cursor-pointer">{store.contact.phone}</span>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {store.category}
                    </span>
                  </div>

                  {/* View Details Button */}
                  <Link
                    to={`/stores/${store._id}`}
                    className="w-full block text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
                  >
                    View Details →
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Stores; 