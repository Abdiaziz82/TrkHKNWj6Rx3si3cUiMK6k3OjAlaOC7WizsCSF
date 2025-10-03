import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Users, TrendingUp, BarChart3, Zap, CheckCircle, Star, ArrowRight, Cloud, Database, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] to-[#FDF5ED] font-sans overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#F5E9E1] rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-20 right-20 w-24 h-24 bg-[#E8D8C9] rounded-full opacity-20 animate-bounce"></div>
      <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-[#F5E9E1] rounded-full opacity-15"></div>
      <div className="absolute bottom-10 right-10 w-28 h-28 bg-[#E8D8C9] rounded-full opacity-25 animate-pulse"></div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm px-8 py-6 flex justify-between items-center border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <motion.div 
          className="text-3xl font-bold italic text-[#8C6A50] tracking-wide"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          Nitpick
        </motion.div>
        
        <div className="flex space-x-2">
          <motion.div 
            className="w-3 h-3 bg-gray-300 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          ></motion.div>
          <motion.div 
            className="w-3 h-3 bg-gray-300 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
          ></motion.div>
          <motion.div 
            className="w-3 h-3 bg-gray-300 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
          ></motion.div>
        </div>
      </header>

      {/* Hero Section - Full Width */}
      <section className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <motion.div 
              className="text-left"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block bg-gradient-to-r from-[#A57C5F]/20 to-[#8C6A50]/20 text-[#8C6A50] px-4 py-2 rounded-full text-sm font-medium mb-6">
                AI-Powered Bookkeeping
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Your Business
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#8C6A50] to-[#A57C5F]">
                  Financial Management
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Say goodbye to manual bookkeeping and hello to AI-powered automation. 
                Nitpick intelligently manages your finances, provides real-time insights, 
                and helps you make smarter business decisions.
              </p>

              {/* Key Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {[
                  { icon: <Zap className="w-5 h-5" />, title: "Real-time Updates", desc: "Instant financial insights" },
                  { icon: <Users className="w-5 h-5" />, title: "Team Collaboration", desc: "Seamless team access" },
                  { icon: <TrendingUp className="w-5 h-5" />, title: "Smart Analytics", desc: "AI-driven recommendations" },
                  { icon: <Cloud className="w-5 h-5" />, title: "Cloud Sync", desc: "Access anywhere, anytime" }
                ].map((benefit, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start space-x-3 bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-[#F5E9E1]"
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-[#A57C5F] to-[#8C6A50] rounded-lg flex items-center justify-center text-white mt-1">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-600">{benefit.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Visual */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-r from-[#A57C5F] to-[#8C6A50] rounded-3xl blur-xl opacity-20"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl border border-[#F5E9E1] p-8">
                  <div className="text-center">
                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-[#A57C5F] to-[#8C6A50] rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <BarChart3 className="w-24 h-24 text-white drop-shadow-lg" />
                    </div>
                    <div className="text-[#8C6A50] font-bold text-2xl mb-2">AI Analytics Dashboard</div>
                    <div className="text-gray-600 text-lg">Live financial insights</div>
                  </div>
                  
                  {/* Login/Register Form */}
                  <div className="mt-10 bg-[#FFF8F0] rounded-2xl p-6 border border-[#F5E9E1]">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Get Started Today</h3>
                    <div className="space-y-4">
                      <motion.button 
                        className="w-full bg-gradient-to-r from-[#A57C5F] to-[#8C6A50] text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 border-0"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Link to="/register" className="w-full h-full flex items-center justify-center">
                          Create Free Account
                        </Link>
                      </motion.button>
                      <motion.button 
                        className="w-full bg-white text-[#8C6A50] py-4 px-6 rounded-xl font-bold text-lg border-2 border-[#A57C5F] shadow-sm hover:shadow-md hover:bg-[#FFF8F0] transform hover:-translate-y-0.5 transition-all duration-300"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <Link to="/login" className="w-full h-full flex items-center justify-center">
                          Sign In to Your Account
                        </Link>
                      </motion.button>
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-4">
                      Free 14-day trial • No credit card required
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to streamline your financial operations and grow your business
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <Database className="w-8 h-8" />, 
                title: "Automated Bookkeeping", 
                desc: "AI automatically categorizes expenses, tracks income, and maintains accurate records in real-time." 
              },
              { 
                icon: <Smartphone className="w-8 h-8" />, 
                title: "Mobile-First Design", 
                desc: "Manage your finances from anywhere with our intuitive mobile and desktop applications." 
              },
              { 
                icon: <Shield className="w-8 h-8" />, 
                title: "Bank-Level Security", 
                desc: "Your data is protected with enterprise-grade encryption and SOC 2 compliance." 
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#F5E9E1]"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-[#A57C5F] to-[#8C6A50] rounded-xl flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration & Trust Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 bg-white/70 backdrop-blur-sm rounded-full px-8 py-4 border border-[#F5E9E1] inline-flex mb-8">
              <div className="w-6 h-6 text-[#8C6A50]">
                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                </svg>
              </div>
              <span className="font-semibold text-[#8C6A50] text-lg">Seamless Integration with Leading Platforms</span>
            </div>
          </div>

          {/* Security & Trust */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Enterprise-Grade Security</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Your financial data deserves the highest level of protection. 
                We implement bank-level security measures to keep your information safe and private.
              </p>
              <div className="space-y-4">
                {[
                  "SOC 2 Type II compliant",
                  "256-bit SSL encryption",
                  "Regular security audits",
                  "GDPR & CCPA compliant"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-[#8C6A50]" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <motion.div 
              className="bg-gradient-to-r from-[#8C6A50]/10 to-[#A57C5F]/10 rounded-3xl p-8 backdrop-blur-sm border border-[#F5E9E1]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-center space-x-6 mb-6">
                <Shield className="w-8 h-8 text-[#8C6A50]" />
                <Lock className="w-8 h-8 text-[#A57C5F]" />
                <Star className="w-8 h-8 text-[#8C6A50]" />
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#8C6A50] mb-2">99.9%</div>
                <p className="text-gray-600">Uptime Guarantee</p>
              </div>
            </motion.div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-20 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "25K+", label: "Active Users" },
                { value: "4.9★", label: "Customer Rating" },
                { value: "99.9%", label: "Uptime" },
                { value: "24/7", label: "Support" }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-[#F5E9E1]"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-3xl font-bold text-[#8C6A50] mb-2">{stat.value}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#8C6A50] to-[#A57C5F]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Join thousands of businesses that have already streamlined their financial operations with Nitpick.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
            <motion.button 
              className="bg-white text-[#8C6A50] py-4 px-10 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/register" className="flex items-center justify-center space-x-2">
                <span>Start Your Free Trial</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.button>
            <motion.button 
              className="bg-transparent text-white py-4 px-10 rounded-2xl font-bold text-lg border-2 border-white hover:bg-white/10 transform hover:-translate-y-1 transition-all duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Schedule a Demo
            </motion.button>
          </div>
          
          <p className="text-white/70 mt-6 text-sm">
            Free 14-day trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm py-8 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-bold italic text-[#8C6A50] mb-4">Nitpick</div>
          <p className="text-gray-600">© 2024 Nitpick. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}