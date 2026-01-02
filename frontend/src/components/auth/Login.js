import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaShoppingBag } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Login = () => {
  const { login, loading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    const res = await login(form.email, form.password);
    if (res.success) {
      toast.success('Login successful!');
      // Small delay to ensure state updates before navigation
      setTimeout(() => {
        navigate('/dashboard');
      }, 300);
    } else {
      toast.error(res.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background shapes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.15, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.12, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400 rounded-full blur-3xl"
      />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-4"
            >
              <FaShoppingBag className="text-4xl text-blue-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-blue-700 mb-2">MallBook</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="form-group"
            >
              <label className="form-label flex items-center gap-2">
                <FaEnvelope className="text-blue-500" />
                Email Address
              </label>
              <input
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoFocus
              />
              {errors.email && (
                <p className="form-error text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="form-group"
            >
              <label className="form-label flex items-center gap-2">
                <FaLock className="text-blue-500" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-input ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="form-error text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full font-semibold text-lg py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 space-y-4"
          >
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Create one
              </Link>
            </p>
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Demo: use any email and password (min 6 chars)
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login; 