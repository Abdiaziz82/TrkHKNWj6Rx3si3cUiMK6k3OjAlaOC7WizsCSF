import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import{ FiBook } from 'react-icons/fi';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeField, setActiveField] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage(data.message);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          password: '',
          confirmPassword: ''
        });
        
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setErrors({ submit: data.message });
      }
    } catch (error) {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating animated shapes */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-200/40 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-blue-300/30 rounded-full blur-2xl animate-float-delayed"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-400/20 rounded-lg rotate-45 blur-xl animate-pulse"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(#1e3a8a 1px, transparent 1px),
                              linear-gradient(90deg, #1e3a8a 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Section - Interactive Hero */}
        <div className="flex flex-col justify-center p-8 lg:p-12">
          <div className="space-y-8">
            {/* Animated Logo */}
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center rounded-2xl shadow-lg transform group-hover:scale-105 transition-transform duration-300">
               <FiBook className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900"></h1>
                
              </div>
            </div>
            
            {/* Main Headline with Animation */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Start Your
                <br />
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    Business Journey
                  </span>
                  <div className="absolute bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-blue-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </span>
              </h1>
              
              <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
                Join thousands of businesses already managing their inventory and finances smarter with our AI-powered platform.
              </p>
            </div>

            {/* Interactive Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8">
              <div className="group p-6 bg-white/70 rounded-2xl border border-blue-100 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank-Level Security</h3>
                <p className="text-gray-700 text-sm">Your data is encrypted and protected with enterprise-grade security</p>
              </div>
              
              <div className="group p-6 bg-white/70 rounded-2xl border border-blue-100 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:border-blue-300">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-700 text-sm">Real-time updates and instant insights for quick decision making</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">10K+</div>
                <div className="text-sm text-gray-700">Active Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">99.9%</div>
                <div className="text-sm text-gray-700">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">24/7</div>
                <div className="text-sm text-gray-700">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Interactive Registration Form */}
        <div className="flex items-center justify-center p-6 lg:p-8">
          <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-blue-100 hover:shadow-blue-100/20 transition-all duration-500">
            
            {/* Form Header with Icon */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Us Today</h2>
              <p className="text-gray-700">Create your account in seconds</p>
            </div>

            {/* Messages */}
            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-green-700 text-sm">{successMessage}</p>
              </div>
            )}

            {errors.submit && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-red-700 text-sm">{errors.submit}</p>
              </div>
            )}

            {/* Registration Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-900">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    onFocus={() => setActiveField('firstName')}
                    onBlur={() => setActiveField('')}
                    className={`w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none border-2 rounded-xl transition-all duration-300 ${
                      errors.firstName 
                        ? 'border-red-500 shadow-lg shadow-red-500/20' 
                        : activeField === 'firstName'
                        ? 'border-blue-600 shadow-lg shadow-blue-600/20'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-900">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    onFocus={() => setActiveField('lastName')}
                    onBlur={() => setActiveField('')}
                    className={`w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none border-2 rounded-xl transition-all duration-300 ${
                      errors.lastName 
                        ? 'border-red-500 shadow-lg shadow-red-500/20' 
                        : activeField === 'lastName'
                        ? 'border-blue-600 shadow-lg shadow-blue-600/20'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField('')}
                  className={`w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none border-2 rounded-xl transition-all duration-300 ${
                    errors.email 
                      ? 'border-red-500 shadow-lg shadow-red-500/20' 
                      : activeField === 'email'
                      ? 'border-blue-600 shadow-lg shadow-blue-600/20'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  placeholder="john@company.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-900">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  onFocus={() => setActiveField('phoneNumber')}
                  onBlur={() => setActiveField('')}
                  className={`w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none border-2 rounded-xl transition-all duration-300 ${
                    errors.phoneNumber 
                      ? 'border-red-500 shadow-lg shadow-red-500/20' 
                      : activeField === 'phoneNumber'
                      ? 'border-blue-600 shadow-lg shadow-blue-600/20'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setActiveField('password')}
                    onBlur={() => setActiveField('')}
                    className={`w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none border-2 rounded-xl transition-all duration-300 ${
                      errors.password 
                        ? 'border-red-500 shadow-lg shadow-red-500/20' 
                        : activeField === 'password'
                        ? 'border-blue-600 shadow-lg shadow-blue-600/20'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                    placeholder="Create a strong password"
                  />
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Password strength</span>
                        <span className={`font-medium ${
                          passwordStrength < 50 ? 'text-red-500' :
                          passwordStrength < 75 ? 'text-yellow-500' : 'text-green-500'
                        }`}>
                          {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Good' : 'Strong'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            passwordStrength < 50 ? 'bg-red-500' :
                            passwordStrength < 75 ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setActiveField('confirmPassword')}
                    onBlur={() => setActiveField('')}
                    className={`w-full px-4 py-3 bg-white text-gray-900 placeholder-gray-500 focus:outline-none border-2 rounded-xl transition-all duration-300 ${
                      errors.confirmPassword 
                        ? 'border-red-500 shadow-lg shadow-red-500/20' 
                        : activeField === 'confirmPassword'
                        ? 'border-blue-600 shadow-lg shadow-blue-600/20'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full group relative py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl shadow-blue-600/25 hover:shadow-blue-700/30"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Your Account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <span>Create Account</span>
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center pt-6 border-t border-gray-300">
                <p className="text-gray-700">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-700 hover:text-blue-800 transition-colors duration-200"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Register;