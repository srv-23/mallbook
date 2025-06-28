import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaShoppingBag, FaUser, FaSignInAlt } from 'react-icons/fa';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';

const Navbar = ({ onToggleTheme, theme }) => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitial = (name) => name ? name.charAt(0).toUpperCase() : '';

  return (
    <nav className="bg-[#232323] text-white sticky top-0 z-50 border-b border-[#232323] shadow flex items-center justify-between h-16 px-4">
      {/* Left: Logo and Brand */}
      <div className="flex items-center gap-3">
        <Link to="/" className="flex items-center gap-3">
          <FaShoppingBag className="text-2xl text-orange-400" />
          <span className="text-2xl font-bold tracking-wide text-white">MallBook</span>
        </Link>
      </div>
      {/* Right: Theme toggler and Login/User */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleTheme}
          className={`p-2.5 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
            theme === 'dark' 
              ? 'bg-yellow-500 border-yellow-400 text-yellow-900 hover:bg-yellow-400' 
              : 'bg-blue-500 border-blue-400 text-white hover:bg-blue-400'
          }`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <BsSunFill className="text-lg" />
          ) : (
            <BsMoonFill className="text-lg" />
          )}
        </button>
        {!isAuthenticated ? (
          <Link
            to="/login"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-orange-400 text-white font-semibold hover:bg-orange-500 transition-all duration-200 hover:scale-105 border-2 border-orange-300"
          >
            <FaSignInAlt className="text-lg" />
            <span>Login</span>
          </Link>
        ) : (
          <div className="relative group">
            <button className="flex items-center gap-2 focus:outline-none p-2 rounded-lg hover:bg-[#393939] transition-all duration-200">
              <span className="w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center text-lg font-bold text-white">
                {getInitial(user?.name)}
              </span>
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-[#232323] rounded-xl shadow-lg py-2 z-50 border border-[#393939] opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-[#393939] rounded-lg text-red-400">Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
