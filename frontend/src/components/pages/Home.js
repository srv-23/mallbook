import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarCheck, FaStore, FaTags, FaUserFriends, FaArrowRight, FaShoppingBag } from 'react-icons/fa';
import { motion } from 'framer-motion';

const featureVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } })
};

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 overflow-hidden">
      {/* Animated background shapes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 3 }}
        className="fixed -top-40 -left-40 w-96 h-96 bg-blue-400 rounded-full blur-3xl z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 3, delay: 0.5 }}
        className="fixed -bottom-40 -right-40 w-96 h-96 bg-indigo-400 rounded-full blur-3xl z-0"
      />

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 py-20 md:py-32 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-700">
            Welcome to <span className="block mt-2">MallBook</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 font-light">
            Your complete mall experience in one app
          </p>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto mb-10">
            Book services, explore stores, and discover exclusive deals at MallBook. Everything you need for the perfect shopping, dining, and entertainment experience – all in one place.
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row justify-center gap-6 mb-24"
          >
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-xl hover:shadow-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
            >
              <FaCalendarCheck /> Book a Service
              <FaArrowRight className="text-sm" />
            </Link>
            <Link
              to="/stores"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-xl hover:shadow-2xl border-2 border-blue-600 hover:bg-blue-50 transition-all duration-300 transform hover:scale-105"
            >
              <FaStore /> Explore Stores
              <FaArrowRight className="text-sm" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 mt-24"
        >
          {[
            {
              icon: <FaCalendarCheck className="text-3xl" />,
              title: 'Easy Booking',
              desc: 'Reserve appointments and services instantly in just a few clicks.',
              color: 'from-blue-500 to-blue-600'
            },
            {
              icon: <FaStore className="text-3xl" />,
              title: 'Premium Stores',
              desc: 'Discover top-rated stores across 3 floors with diverse categories.',
              color: 'from-green-500 to-green-600'
            },
            {
              icon: <FaTags className="text-3xl" />,
              title: 'Best Deals',
              desc: 'Unlock exclusive offers and special discounts for members.',
              color: 'from-yellow-500 to-yellow-600'
            },
            {
              icon: <FaUserFriends className="text-3xl" />,
              title: 'For Everyone',
              desc: 'Perfect for families, friends, and special occasions.',
              color: 'from-purple-500 to-purple-600'
            }
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              variants={featureVariants}
              className="group bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-t-4 border-transparent hover:border-blue-600"
              whileHover={{ y: -5 }}
            >
              <div className={`bg-gradient-to-br ${feature.color} text-white w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="bg-white rounded-lg shadow-xl p-8 mb-16 border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">32+</div>
              <p className="text-gray-600 font-semibold">Premium Stores</p>
              <p className="text-sm text-gray-500">Across 3 floors</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
              <p className="text-gray-600 font-semibold">Services Available</p>
              <p className="text-sm text-gray-500">Ready to book</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">₹100 - ₹1000</div>
              <p className="text-gray-600 font-semibold">Service Price Range</p>
              <p className="text-sm text-gray-500">Budget-friendly options</p>
            </div>
          </div>
        </motion.div>

        {/* Call to Action Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-2xl p-12 text-white text-center"
        >
          <div className="flex justify-center mb-4">
            <FaShoppingBag className="text-5xl opacity-90" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Booking?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who already enjoy seamless mall experiences with MallBook.
          </p>
          <Link
            to="/services"
            className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span>Explore Services Now</span>
            <FaArrowRight />
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home; 