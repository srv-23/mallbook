import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarCheck, FaStore, FaTags, FaUserFriends } from 'react-icons/fa';
import { motion } from 'framer-motion';

const featureVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15 } })
};

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 min-h-screen flex flex-col justify-center items-center py-12 relative overflow-hidden">
      {/* Animated background shapes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300 rounded-full blur-3xl z-0"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.12, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400 rounded-full blur-3xl z-0"
      />
      <section className="container text-center py-12 relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-blue-700"
        >
          Welcome to <span className="text-blue-900">MallBook</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto"
        >
          Book your favorite services, reserve facilities, and explore the best stores at MallBook. Enjoy a seamless online booking experience for shopping, dining, entertainment, and more!
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col md:flex-row justify-center gap-4 mb-10"
        >
          <Link to="/services" className="btn btn-primary text-lg shadow-lg hover:scale-105 transition-transform duration-200">Book a Service</Link>
          <Link to="/stores" className="btn btn-secondary text-lg shadow-lg hover:scale-105 transition-transform duration-200">Explore Stores</Link>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
          {[{
            icon: <FaCalendarCheck className="text-3xl text-blue-600 mb-2" />, title: 'Easy Booking', desc: 'Book appointments and services in just a few clicks.'
          }, {
            icon: <FaStore className="text-3xl text-blue-600 mb-2" />, title: 'Top Stores', desc: 'Discover a wide range of stores and facilities at MallBook.'
          }, {
            icon: <FaTags className="text-3xl text-blue-600 mb-2" />, title: 'Exclusive Deals', desc: 'Enjoy special offers and discounts for online bookings.'
          }, {
            icon: <FaUserFriends className="text-3xl text-blue-600 mb-2" />, title: 'For Everyone', desc: 'Perfect for families, friends, and business gatherings.'
          }].map((f, i) => (
            <motion.div
              key={f.title}
              className="card flex flex-col items-center shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white/80 backdrop-blur"
              custom={i}
              initial="hidden"
              animate="visible"
              variants={featureVariants}
            >
              {f.icon}
              <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home; 