import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FaShoppingBag className="text-3xl text-blue-400" />
              <span className="text-2xl font-bold">MallBook</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your premier destination for online mall bookings. Discover amazing services, 
              book appointments, and explore the best stores all in one place.
            </p>
            <div className="flex gap-6 mt-4">
              <a href="https://facebook.com/yourmall" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-white hover:text-white transition-colors text-2xl" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://instagram.com/yourmall" target="_blank" rel="noopener noreferrer" className="text-pink-500 dark:text-white hover:text-white transition-colors text-2xl" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://twitter.com/yourmall" target="_blank" rel="noopener noreferrer" className="text-sky-400 dark:text-white hover:text-white transition-colors text-2xl" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="text-green-500 dark:text-white hover:text-white transition-colors text-2xl" aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
              <a href="https://youtube.com/yourmall" target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-white hover:text-white transition-colors text-2xl" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/stores" className="text-gray-300 hover:text-white transition-colors">
                  Stores
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-blue-400" />
                <span className="text-gray-300">Phoenix Marketcity, LBS Road, Kurla West, Mumbai, Maharashtra 400070, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="text-blue-400" />
                <span className="text-gray-300">+91 22 6180 0044</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-blue-400" />
                <span className="text-gray-300">info@mallbook.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} MallBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 