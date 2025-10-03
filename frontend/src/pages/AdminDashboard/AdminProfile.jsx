// AdminProfile.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleQuickAction = (action) => {
    // Store the selected action in localStorage or context
    localStorage.setItem('selectedSetting', action);
    navigate('/admin-dashboard/settings');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Wholesaler Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              {/* Profile Header */}
              <div className="flex items-start space-x-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <span className="text-white text-3xl font-bold">
                      {user?.first_name?.[0] || "A"}
                      {user?.last_name?.[0] || "P"}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
                </div>

                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-gray-600 text-lg mb-3">{user?.email}</p>
                  <div className="flex items-center space-x-3">
                    <span className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg capitalize">
                      {user?.role || "admin"} Account
                    </span>
                    <span className="px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-full border border-green-200">
                      ● Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    First Name
                  </label>
                  <p className="text-gray-900 font-semibold text-lg">
                    {user?.first_name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Last Name
                  </label>
                  <p className="text-gray-900 font-semibold text-lg">
                    {user?.last_name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Email Address
                  </label>
                  <p className="text-gray-900 font-semibold text-lg">
                    {user?.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Phone Number
                  </label>
                  <p className="text-gray-900 font-semibold text-lg">
                    {user?.phone_number || (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Account Type
                  </label>
                  <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent capitalize">
                    {user?.role || "Admin"} Administrator
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleQuickAction('edit-profile')}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-xl transition-all duration-200 border border-transparent hover:border-purple-200 flex items-center space-x-3"
                >
                  <span className="text-lg">✏️</span>
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => handleQuickAction('change-password')}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200 flex items-center space-x-3"
                >
                  <span className="text-lg">🔑</span>
                  <span>Change Password</span>
                </button>
                <button
                  onClick={() => handleQuickAction('account-settings')}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-xl transition-all duration-200 border border-transparent hover:border-green-200 flex items-center space-x-3"
                >
                  <span className="text-lg">⚙️</span>
                  <span>Account Settings</span>
                </button>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-lg font-semibold mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-100">Member Since</span>
                  <span className="font-semibold">2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-100">Last Login</span>
                  <span className="font-semibold">2 hours ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-100">Account Verified</span>
                  <span className="font-semibold text-green-300">✓ Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;