import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font">
   
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.96), rgba(15, 23, 42, 0.98)), url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.1&auto=format&fit=crop&w=2070&q=80')`,
        }}
      />
      
   
      <div 
        className="absolute inset-0 opacity-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80' width='80' height='80' fill='none' stroke='rgb(255 255 255)' stroke-width='0.3'%3e%3cpath d='M0 .5H79.5V80'/%3e%3c/svg%3e")`,
        }}
      />

      {/* Main Container - Clean, Borderless Design */}
      <div className="relative w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">
          
         
          <div className="flex flex-col justify-center p-16 lg:p-20">
            <div className="space-y-8">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">TW</span>
                </div>
                <span className="text-white font-semibold text-2xl tracking-tight">TrkWholesale</span>
              </div>
              
              {/* Headline */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Enterprise
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Wholesale
                  </span>
                  <br />
                  Platform
                </h1>
                
                <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
                  Join the premier wholesale network trusted by Fortune 500 retailers. 
                  Access real-time inventory, predictive analytics, and global supplier networks.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 pt-8">
                <div className="flex items-center gap-5 py-4 border-b border-white/5 last:border-b-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-lg text-slate-300">Real-time inventory management</span>
                </div>
                <div className="flex items-center gap-5 py-4 border-b border-white/5 last:border-b-0">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span className="text-lg text-slate-300">AI-powered demand forecasting</span>
                </div>
                <div className="flex items-center gap-5 py-4 border-b border-white/5 last:border-b-0">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-lg text-slate-300">Global supplier network access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Registration Form */}
          <div className="flex items-center justify-center p-8 lg:p-16">
            <div className="w-full max-w-2xl">
              {/* Form Header */}
              <div className="space-y-2 mb-12">
                <h2 className="text-4xl font-bold text-white">
                  Create Account
                </h2>
                <p className="text-slate-400 text-lg">
                  Join 15,000+ retail partners worldwide
                </p>
              </div>

              {/* Messages */}
              {successMessage && (
                <div className="mb-8 p-4 bg-green-500/10 border-l-4 border-green-500">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-green-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-green-400 text-sm font-medium">{successMessage}</p>
                  </div>
                </div>
              )}

              {errors.submit && (
                <div className="mb-8 p-4 bg-red-500/10 border-l-4 border-red-500">
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-red-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-red-400 text-sm font-medium">{errors.submit}</p>
                  </div>
                </div>
              )}

              {/* Registration Form */}
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 uppercase tracking-wide text-xs">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-0 py-4 bg-transparent text-white placeholder-slate-500 focus:outline-none border-b-2 transition-all duration-300 ${
                        errors.firstName ? 'border-red-500' : 'border-slate-600 focus:border-blue-500'
                      }`}
                      placeholder="Enter first name"
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 uppercase tracking-wide text-xs">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-0 py-4 bg-transparent text-white placeholder-slate-500 focus:outline-none border-b-2 transition-all duration-300 ${
                        errors.lastName ? 'border-red-500' : 'border-slate-600 focus:border-blue-500'
                      }`}
                      placeholder="Enter last name"
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 uppercase tracking-wide text-xs">
                    Business Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-0 py-4 bg-transparent text-white placeholder-slate-500 focus:outline-none border-b-2 transition-all duration-300 ${
                      errors.email ? 'border-red-500' : 'border-slate-600 focus:border-blue-500'
                    }`}
                    placeholder="your@company.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-slate-300 uppercase tracking-wide text-xs">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-0 py-4 bg-transparent text-white placeholder-slate-500 focus:outline-none border-b-2 transition-all duration-300 ${
                      errors.phoneNumber ? 'border-red-500' : 'border-slate-600 focus:border-blue-500'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-400 text-sm mt-1">{errors.phoneNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 uppercase tracking-wide text-xs">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-0 py-4 bg-transparent text-white placeholder-slate-500 focus:outline-none border-b-2 transition-all duration-300 ${
                        errors.password ? 'border-red-500' : 'border-slate-600 focus:border-blue-500'
                      }`}
                      placeholder="Minimum 8 characters"
                    />
                    {errors.password && (
                      <p className="text-red-400 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 uppercase tracking-wide text-xs">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full px-0 py-4 bg-transparent text-white placeholder-slate-500 focus:outline-none border-b-2 transition-all duration-300 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-slate-600 focus:border-blue-500'
                      }`}
                      placeholder="Re-enter password"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full group relative py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating Enterprise Account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <span>Create Enterprise Account</span>
                        <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>

                {/* Login Link */}
                <div className="text-center pt-8 border-t border-white/10">
                  <p className="text-slate-400">
                    Already have an enterprise account?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;