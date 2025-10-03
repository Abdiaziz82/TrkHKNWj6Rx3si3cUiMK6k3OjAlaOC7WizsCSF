import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit3, 
  Shield,
  Building,
  BadgeCheck,
  Star,
  Bell,
  CreditCard,
  HelpCircle,
  Lock,
  Settings
} from 'lucide-react';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  
  // Mock additional user data for demonstration
  const userStats = {
    joinDate: 'January 2024',
    completedOrders: 47,
    rating: 4.8,
    location: 'Dar es Salaam, Tanzania',
    department: user?.role === 'retailer' ? 'Sales & Support' : 'Customer Service',
    lastLogin: '2 hours ago',
    emailVerified: true,
    phoneVerified: false
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'retailer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'customer': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ];

  const quickActions = [
    { icon: Shield, label: 'Security', color: 'blue' },
    { icon: Bell, label: 'Notifications', color: 'green' },
    { icon: CreditCard, label: 'Billing', color: 'purple' },
    { icon: HelpCircle, label: 'Support', color: 'orange' }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-100 hover:bg-blue-100 text-blue-600',
      green: 'bg-green-50 border-green-100 hover:bg-green-100 text-green-600',
      purple: 'bg-purple-50 border-purple-100 hover:bg-purple-100 text-purple-600',
      orange: 'bg-orange-50 border-orange-100 hover:bg-orange-100 text-orange-600'
    };
    return colors[color] || colors.blue;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  First Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    defaultValue={user?.first_name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                    {user?.first_name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  Last Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    defaultValue={user?.last_name}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                    {user?.last_name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 mr-2 text-blue-500" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                    {user?.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Phone className="w-4 h-4 mr-2 text-blue-500" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    defaultValue={user?.phone_number}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                    {user?.phone_number || 'Not provided'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    defaultValue={userStats.location}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                    {userStats.location}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Building className="w-4 h-4 mr-2 text-blue-500" />
                  Department
                </label>
                <p className="text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-200">
                  {userStats.department}
                </p>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="pt-6 border-t border-gray-100">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Additional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Account Status</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Last Login</span>
                  <span className="font-medium text-gray-900">{userStats.lastLogin}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Email Verified</span>
                  <span className="font-medium text-green-600">Verified</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Phone Verified</span>
                  <span className="font-medium text-gray-900">Pending</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Security Settings</h4>
              <p className="text-blue-700 text-sm">Manage your password and security preferences</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-xl">
                <div>
                  <h5 className="font-medium text-gray-900">Password</h5>
                  <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Change
                </button>
              </div>

              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-xl">
                <div>
                  <h5 className="font-medium text-gray-900">Two-Factor Authentication</h5>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  Enable
                </button>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Preferences</h4>
              <p className="text-purple-700 text-sm">Customize your experience</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-xl">
                <div>
                  <h5 className="font-medium text-gray-900">Email Notifications</h5>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex justify-between items-center p-4 border border-gray-200 rounded-xl">
                <div>
                  <h5 className="font-medium text-gray-900">SMS Notifications</h5>
                  <p className="text-sm text-gray-600">Receive updates via SMS</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Manage your personal information, security settings, and preferences in one place
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Column - Profile Card & Quick Actions */}
          <div className="xl:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg mx-auto mb-4">
                    <span className="text-white text-xl font-bold">
                      {getInitials(user?.first_name, user?.last_name)}
                    </span>
                  </div>
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
                
                <h2 className="text-lg font-bold text-gray-900 mb-1">
                  {user?.first_name} {user?.last_name}
                </h2>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(user?.role)} mb-2`}>
                  <Shield className="w-3 h-3 mr-1" />
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </div>
                <p className="text-gray-600 text-xs flex items-center justify-center">
                  <BadgeCheck className="w-3 h-3 mr-1 text-blue-500" />
                  Verified Account
                </p>
              </div>

              {/* Stats */}
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Member since</span>
                  <span className="text-xs font-medium text-gray-900 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {userStats.joinDate}
                  </span>
                </div>
                
                {user?.role === 'customer' && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Completed Orders</span>
                    <span className="text-xs font-medium text-gray-900">
                      {userStats.completedOrders}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Rating</span>
                  <span className="text-xs font-medium text-gray-900 flex items-center">
                    <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                    {userStats.rating}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg text-sm"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            {/* Quick Actions Card - Compact version */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className={`p-3 text-center rounded-xl transition-all duration-200 border ${getColorClasses(action.color)} flex flex-col items-center justify-center min-h-[80px]`}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2">
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-100">
                <nav className="flex -mb-px">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 flex items-center justify-center ${
                        activeTab === tab.id
                          ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <tab.icon className="w-4 h-4 mr-2" />
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h3>
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;