// AdminProfile.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Settings, 
  Key, 
  Edit3, 
  Shield, 
  Calendar,
  CheckCircle,
  BarChart3,
  Megaphone,
  Users,
  Brain
} from "lucide-react";

const AdminProfile = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleQuickAction = (action) => {
    localStorage.setItem('selectedSetting', action);
    navigate('/admin-dashboard/settings');
  };

  // Mock analytics data matching digital marketing style
  const profileMetrics = [
    { label: "Profile Completion", value: "85%", color: "text-green-600" },
    { label: "Account Security", value: "Strong", color: "text-blue-600" },
    { label: "Last Updated", value: "2 days ago", color: "text-gray-600" }
  ];

  const activityStats = [
    { label: "Campaigns Created", value: "12", trend: "+2" },
    { label: "Team Members", value: "8", trend: "+1" },
    { label: "Active Projects", value: "5", trend: "0" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Wholesaler Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
          </div>
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center space-x-2 shadow-lg">
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Overview Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Profile Header */}
              <div className="flex items-start space-x-6 mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {user?.first_name} {user?.last_name}
                  </h2>
                  <p className="text-gray-600 mb-3">{user?.email}</p>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full shadow capitalize">
                      {user?.role || "admin"} Account
                    </span>
                    <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-50 rounded-full border border-green-200 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {profileMetrics.map((metric, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className={`text-lg font-bold ${metric.color}`}>
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </div>
                ))}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    First Name
                  </label>
                  <p className="text-gray-900 font-semibold">
                    {user?.first_name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Last Name
                  </label>
                  <p className="text-gray-900 font-semibold">
                    {user?.last_name}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Email Address
                  </label>
                  <p className="text-gray-900 font-semibold">
                    {user?.email}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Phone Number
                  </label>
                  <p className="text-gray-900 font-semibold">
                    {user?.phone_number || (
                      <span className="text-gray-400 italic">Not provided</span>
                    )}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Account Type
                  </label>
                  <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent capitalize">
                    {user?.role || "Admin"} Administrator
                  </p>
                </div>
              </div>
            </div>

            {/* Activity Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                Activity Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {activityStats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                    <div className="text-xs text-green-600 font-medium mt-1">
                      {stat.trend}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleQuickAction('edit-profile')}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200 flex items-center space-x-3 group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Edit3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Edit Profile</div>
                    <div className="text-sm text-gray-500">Update personal information</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickAction('change-password')}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200 flex items-center space-x-3 group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Key className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Change Password</div>
                    <div className="text-sm text-gray-500">Update security settings</div>
                  </div>
                </button>

                <button
                  onClick={() => handleQuickAction('account-settings')}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-200 flex items-center space-x-3 group"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Account Settings</div>
                    <div className="text-sm text-gray-500">Manage preferences</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-200" />
                Account Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-blue-500/30">
                  <span className="text-blue-100">Member Since</span>
                  <span className="font-semibold">2024</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-blue-500/30">
                  <span className="text-blue-100">Last Login</span>
                  <span className="font-semibold">2 hours ago</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-100">Account Verified</span>
                  <span className="font-semibold text-green-300 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Megaphone className="w-5 h-5 text-blue-600" />
                  <span>Marketing Tools</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Team Management</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span>AI Insights</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;