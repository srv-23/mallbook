import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaSearch, FaMapMarkerAlt, FaPhone, FaUserCircle } from 'react-icons/fa';
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
    <div className="container py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-blue-700 text-center">Explore Stores at MallBook</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
        <div className="flex items-center border rounded-lg px-3 py-2 bg-white w-full md:w-1/3">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search stores..."
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
        <select
          className="form-input w-full md:w-1/4"
          value={floor}
          onChange={e => setFloor(e.target.value)}
        >
          <option value="">All Floors</option>
          {floors.map(f => (
            <option key={f} value={f}>Floor {f}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <LoadingSpinner key={i} skeleton size="lg" className="w-full h-40" />
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center text-gray-500 mt-12">No stores found.</div>
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
          {stores.map((store, idx) => (
            <motion.div
              key={store._id}
              className="card flex flex-col h-full shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white/90 backdrop-blur"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-1 text-blue-700 flex items-center gap-2">
                  {store.logo ? (
                    <img src={store.logo} alt="Store Logo" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <FaUserCircle className="w-7 h-7 text-gray-400" />
                  )}
                  {store.name}
                </h2>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{store.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <FaMapMarkerAlt />
                  <span>Floor {store.location.floor}, Unit {store.location.unit}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaPhone />
                  <span>{store.contact.phone}</span>
                </div>
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <span className="badge badge-info">{store.category}</span>
                <Link to={`/stores/${store._id}`} className="btn btn-primary w-full">View Details</Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Stores; 