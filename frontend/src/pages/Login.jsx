import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiBook, FiPackage, FiDollarSign } from 'react-icons/fi';
import axios from 'axios';


const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));

        if (response.data.user.role === 'customer') {
          window.location.href = '/customer-dashboard';
        } else if (response.data.user.role === 'admin') {
          window.location.href = '/admin-dashboard';
        } else {
          window.location.href = '/dashboard';
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50/30 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(179, 141, 124, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(179, 141, 124, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Floating Shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-amber-200/30 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-amber-200/20 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-amber-300/20 rounded-lg rotate-45 blur-lg" />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        {/* Left Section - Brand & Value Proposition */}
        <div className="flex flex-col justify-center p-6 lg:p-8">
          <div className="space-y-8">
            {/* Brand Header */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-700 to-amber-800 opacity-60 flex items-center justify-center rounded-2xl shadow-lg">
                  <FiBook className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">LedgerAI</h1>
                  <p className="text-amber-700/80 text-sm">Business Intelligence</p>
                </div>
              </div>

              {/* Value Proposition */}
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                  Your AI<br />
                  <span className="text-amber-700 opacity-70">Bookkeeper.</span>
                </h1>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-white/60 rounded-xl border border-amber-100 backdrop-blur-sm">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <FiPackage className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Simple Inventory.</h3>
                      <p className="text-gray-600 text-sm">Track and manage your stock effortlessly</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-white/60 rounded-xl border border-amber-100 backdrop-blur-sm">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                      <FiDollarSign className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Smart Savings.</h3>
                      <p className="text-gray-600 text-sm">Optimize costs and maximize profits</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-xl border border-amber-100">

            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white text-gray-800 placeholder-gray-400 focus:outline-none border border-gray-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded-lg transition-all duration-200"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-white text-gray-800 placeholder-gray-400 focus:outline-none border border-gray-300 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 rounded-lg transition-all duration-200"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-600"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="/forgot-password" className="text-sm text-amber-600 hover:text-amber-700 transition-colors duration-200">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group relative py-3.5 bg-amber-700 opacity-60 hover:bg-amber-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-700/20"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>Sign In</span>
                      <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Registration Link */}
            <div className="text-center pt-6 mt-6 border-t border-gray-200">
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-amber-600 hover:text-amber-700 transition-colors duration-200"
                >
                  Get started
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;