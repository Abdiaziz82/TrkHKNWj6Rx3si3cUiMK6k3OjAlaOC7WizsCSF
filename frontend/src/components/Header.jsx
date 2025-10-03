import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t, i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0 transition-transform duration-200 hover:scale-105"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent tracking-tight">
                {t("brand")}
              </h1>
            </div>
          </Link>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            {/* Language Switch */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => changeLanguage("en")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  currentLanguage === "en" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLanguage("sw")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  currentLanguage === "sw" 
                    ? "bg-white text-blue-600 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                SW
              </button>
            </div>

            <div className="h-6 w-px bg-gray-300"></div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-all duration-200 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200"
              >
                {t("navbar.login")}
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:shadow-blue-500/25 border border-blue-600 hover:border-blue-700"
              >
                {t("navbar.register")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;