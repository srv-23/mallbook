import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaShoppingBag, FaSignInAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + MallBook */}
          <Link to="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
              <FaShoppingBag className="text-xl text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">MallBook</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center justify-center gap-20 flex-1">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-4 py-2">
              Home
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-4 py-2">
              Services
            </Link>
            <Link to="/stores" className="text-gray-700 hover:text-blue-600 transition-colors font-medium px-4 py-2">
              Stores
            </Link>
          </div>

          {/* Login Button */}
          <div>
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                <FaSignInAlt className="text-base" />
                Login
              </Link>
            ) : (
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
