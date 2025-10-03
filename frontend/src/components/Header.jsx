import React from 'react';
import { Link } from 'react-router-dom'
const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              TrkWholesale
            </h1>
          </Link>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-3">
            <Link to="/login" className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 rounded-lg hover:bg-gray-50">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
              Register
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;