
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center  overflow-hidden">
      
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.1&auto=format&fit=crop&w=2070&q=80')",
        }}
        aria-hidden="true"
      />

      <div className="absolute inset-0 bg-black/65" aria-hidden="true" />

      {/* Ultra-Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' width='100' height='100' fill='none' stroke='rgb(255 255 255)' stroke-width='0.5'%3e%3cpath d='M0 0L100 100M100 0L0 100'/%3e%3c/svg%3e")`,
        }}
      />

      
      <div className="relative w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 min-h-screen items-center font">
        
        
        <div className="flex flex-col justify-center p-8 lg:p-12 xl:p-14">
          <div className="space-y-10">
         
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-transparent flex items-center justify-center rounded-md shadow-xl">

                  <span className="text-white font-bold text-xl tracking-tight">TW</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">TrkWholesale</h1>
                  <p className="text-slate-400 text-sm font-light">Enterprise Platform</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Enterprise
                  <br />
                  <span className="text-indigo-300">Intelligence</span>
                </h1>
                <p className="text-lg text-slate-300 leading-relaxed max-w-2xl font-light">
                  Access your wholesale dashboard with enterprise-grade security and AI-powered insights.
                </p>
              </div>
            </div>

            {/* Enterprise Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 py-2 group cursor-pointer">
                <div className="w-8 h-8 bg-white/6 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-lg text-slate-300">Military-grade security protocols</span>
              </div>
              
              <div className="flex items-center gap-4 py-2 group cursor-pointer">
                <div className="w-8 h-8 bg-white/6 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-lg text-slate-300">Real-time business analytics</span>
              </div>
              
              <div className="flex items-center gap-4 py-2 group cursor-pointer">
                <div className="w-8 h-8 bg-white/6 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-lg text-slate-300">Global supplier network access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Premium Login Form (reduced paddings) */}
        <div className="flex items-center justify-center p-6 lg:p-8 xl:p-10">
          <div className="w-full max-w-md">
            {/* Form Header */}
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                Welcome Back
              </h2>
              <p className="text-slate-400 text-base font-light">
                Sign in to your enterprise account
              </p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-3 bg-red-500/10 border-l-4 border-red-500 backdrop-blur-sm rounded-md">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-500 flex items-center justify-center rounded-sm">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 uppercase tracking-wider text-xs">
                  Business Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 text-white placeholder-slate-400 focus:outline-none border-b-2 border-slate-600 focus:border-indigo-500 transition-all duration-300 font-light rounded-t-sm"
                    placeholder="your@company.com"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 uppercase tracking-wider text-xs">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-3 bg-white/5 text-white placeholder-slate-400 focus:outline-none border-b-2 border-slate-600 focus:border-indigo-500 transition-all duration-300 font-light"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                    />
                    <div className="w-5 h-5 bg-white/5 border border-slate-600 flex items-center justify-center transition-all duration-200 hover:border-slate-500 rounded-sm">
                      <svg className="w-3 h-3 text-indigo-500 opacity-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <span className="text-sm text-slate-400 font-light">Remember this device</span>
                </label>
                <a href="/forgot-password" className="text-sm text-indigo-300 hover:text-indigo-200 transition-colors duration-200 font-light">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button - solid color (no gradient) */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group relative py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-base transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-indigo-700/20 rounded-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <span>Access Enterprise Dashboard</span>
                      <FiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  )}
                </button>
              </div>
            </form>

            {/* Registration Link */}
            <div className="text-center pt-8 border-t border-white/10">
              <p className="text-slate-400 font-light">
                Need an enterprise account?{' '}
                <Link 
                  to="/register" 
                  className="font-semibold text-indigo-300 hover:text-indigo-200 transition-colors duration-200"
                >
                  Request access
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
