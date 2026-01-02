import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp, FaYoutube, FaArrowUp } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'Home', path: '/' },
    { label: 'Services', path: '/services' },
    { label: 'Stores', path: '/stores' },
  ];

  const socialLinks = [
    { icon: FaFacebookF, url: 'https://facebook.com/mallbook', label: 'Facebook', color: 'hover:text-blue-400' },
    { icon: FaInstagram, url: 'https://instagram.com/mallbook', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: FaTwitter, url: 'https://twitter.com/mallbook', label: 'Twitter', color: 'hover:text-sky-400' },
    { icon: FaWhatsapp, url: 'https://wa.me/919999999999', label: 'WhatsApp', color: 'hover:text-green-400' },
    { icon: FaYoutube, url: 'https://youtube.com/mallbook', label: 'YouTube', color: 'hover:text-red-400' },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Back to Top Button */}
      <motion.button
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <FaArrowUp className="text-lg" />
      </motion.button>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="col-span-1 md:col-span-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <FaShoppingBag className="text-2xl text-white" />
              </div>
              <span className="text-3xl font-bold">MallBook</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Your premier destination for online mall bookings. Discover amazing services, book appointments, and explore the best stores all in one place across 3 beautiful floors.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => {
                const SocialIcon = social.icon;
                return (
                  <motion.a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-gray-800 p-3 rounded-lg text-white transition-all duration-300 ${social.color}`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    aria-label={social.label}
                  >
                    <SocialIcon className="text-lg" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-2 h-2 bg-blue-600 rounded-full group-hover:w-3 transition-all"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-6 text-white">Contact Info</h3>
            <div className="space-y-4">
              {/* Address */}
              <div className="flex gap-3">
                <div className="bg-blue-600/20 p-3 rounded-lg flex-shrink-0">
                  <FaMapMarkerAlt className="text-blue-400 text-lg" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <p className="text-white font-semibold">Phoenix Marketcity, Mumbai, India</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-3">
                <div className="bg-blue-600/20 p-3 rounded-lg flex-shrink-0">
                  <FaPhone className="text-blue-400 text-lg" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <p className="text-white font-semibold">+91 22 6180 0044</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-3">
                <div className="bg-blue-600/20 p-3 rounded-lg flex-shrink-0">
                  <FaEnvelope className="text-blue-400 text-lg" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white font-semibold">info@mallbook.in</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} <span className="text-blue-400 font-bold">MallBook</span>. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Made with ❤️ for shopping & dining experiences
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 