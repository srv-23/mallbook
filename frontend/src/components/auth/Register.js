import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaShoppingBag, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Register = () => {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (form.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }

    if (!form.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!form.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm password';
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    const res = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.replace(/\D/g, ''),
      password: form.password
    });

    if (res.success) {
      toast.success('Account created successfully!');
      // Small delay to ensure state updates before navigation
      setTimeout(() => {
        navigate('/dashboard');
      }, 300);
    } else {
      toast.error(res.message || 'Registration failed');
    }
  };

  const passwordStrength = {
    score: 0,
    label: 'Weak',
    color: 'red'
  };

  if (form.password) {
    let score = 0;
    if (form.password.length >= 8) score++;
    if (/[a-z]/.test(form.password)) score++;
    if (/[A-Z]/.test(form.password)) score++;
    if (/\d/.test(form.password)) score++;
    if (/[^a-zA-Z\d]/.test(form.password)) score++;

    if (score <= 2) {
      passwordStrength.score = score;
      passwordStrength.label = 'Weak';
      passwordStrength.color = 'red';
    } else if (score <= 3) {
      passwordStrength.score = score;
      passwordStrength.label = 'Fair';
      passwordStrength.color = 'yellow';
    } else if (score <= 4) {
      passwordStrength.score = score;
      passwordStrength.label = 'Good';
      passwordStrength.color = 'blue';
    } else {
      passwordStrength.score = score;
      passwordStrength.label = 'Strong';
      passwordStrength.color = 'green';
    }
  }

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

      <div className="w-full max-w-2xl relative z-10">
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
            <p className="text-gray-600">Create your account and start booking</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="form-group md:col-span-2"
              >
                <label className="form-label flex items-center gap-2">
                  <FaUser className="text-blue-500" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-input ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  autoFocus
                />
                {errors.name && <p className="form-error text-red-500 text-sm mt-1">{errors.name}</p>}
              </motion.div>

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
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
                />
                {errors.email && <p className="form-error text-red-500 text-sm mt-1">{errors.email}</p>}
              </motion.div>

              {/* Phone Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="form-group"
              >
                <label className="form-label flex items-center gap-2">
                  <FaPhone className="text-blue-500" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-input ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                />
                {errors.phone && <p className="form-error text-red-500 text-sm mt-1">{errors.phone}</p>}
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 }}
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
                {form.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">Password Strength:</span>
                      <span className={`text-xs font-semibold text-${passwordStrength.color}-600`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                        className={`h-2 rounded-full bg-${passwordStrength.color}-500`}
                      />
                    </div>
                  </div>
                )}
                {errors.password && <p className="form-error text-red-500 text-sm mt-1">{errors.password}</p>}
              </motion.div>

              {/* Confirm Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="form-group"
              >
                <label className="form-label flex items-center gap-2">
                  <FaLock className="text-blue-500" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className={`form-input ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {!errors.confirmPassword && form.confirmPassword && form.password === form.confirmPassword && (
                  <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                    <FaCheckCircle /> Passwords match
                  </p>
                )}
                {errors.confirmPassword && <p className="form-error text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full font-semibold text-lg py-3 rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register; 