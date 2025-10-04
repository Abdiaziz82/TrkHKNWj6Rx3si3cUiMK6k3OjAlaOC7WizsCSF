import { useState, useEffect } from 'react';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLock,
  FiBell,
  FiShield,
  FiCreditCard,
  FiSave,
  FiEdit,
  FiX,
  FiCheck,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';

const CustomerSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Customer data state
  const [customerData, setCustomerData] = useState({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      company: 'Doe Restaurants',
      businessType: 'Restaurant',
      taxId: '12-3456789'
    },
    address: {
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      promotionalEmails: true,
      orderUpdates: true,
      priceDropAlerts: true,
      lowStockAlerts: false
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    payment: {
      cards: [
        {
          id: 1,
          type: 'visa',
          last4: '4242',
          expiry: '12/24',
          isDefault: true
        },
        {
          id: 2,
          type: 'mastercard',
          last4: '8888',
          expiry: '06/25',
          isDefault: false
        }
      ]
    }
  });

  // Handle input changes
  const handleInputChange = (section, field, value) => {
    setCustomerData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle preference toggle
  const handlePreferenceToggle = (preference) => {
    setCustomerData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [preference]: !prev.preferences[preference]
      }
    }));
  };

  // Save settings
  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSaving(false);
    setSaveSuccess(true);
    setIsEditing(false);
    
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Add new payment method
  const handleAddPaymentMethod = () => {
    const newCard = {
      id: Date.now(),
      type: 'visa',
      last4: '1111',
      expiry: '03/26',
      isDefault: false
    };
    
    setCustomerData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        cards: [...prev.payment.cards, newCard]
      }
    }));
  };

  // Set default payment method
  const setDefaultPayment = (cardId) => {
    setCustomerData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        cards: prev.payment.cards.map(card => ({
          ...card,
          isDefault: card.id === cardId
        }))
      }
    }));
  };

  // Remove payment method
  const removePaymentMethod = (cardId) => {
    setCustomerData(prev => ({
      ...prev,
      payment: {
        ...prev.payment,
        cards: prev.payment.cards.filter(card => card.id !== cardId)
      }
    }));
  };

  // Change password
  const handlePasswordChange = () => {
    if (customerData.security.newPassword !== customerData.security.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setCustomerData(prev => ({
        ...prev,
        security: {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      }));
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'address', label: 'Address', icon: FiMapPin },
    { id: 'preferences', label: 'Preferences', icon: FiBell },
    { id: 'payment', label: 'Payment', icon: FiCreditCard },
    { id: 'security', label: 'Security', icon: FiShield }
  ];

  const getCardIcon = (type) => {
    const icons = {
      visa: '💳',
      mastercard: '💳',
      amex: '💳',
      discover: '💳'
    };
    return icons[type] || '💳';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and settings</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar Tabs */}
            <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-3" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {/* Save Success Message */}
              {saveSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                  <FiCheck className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">Settings saved successfully!</span>
                </div>
              )}

              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <FiEdit className="w-4 h-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={customerData.profile.firstName}
                        onChange={(e) => handleInputChange('profile', 'firstName', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={customerData.profile.lastName}
                        onChange={(e) => handleInputChange('profile', 'lastName', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={customerData.profile.email}
                        onChange={(e) => handleInputChange('profile', 'email', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={customerData.profile.phone}
                        onChange={(e) => handleInputChange('profile', 'phone', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={customerData.profile.company}
                        onChange={(e) => handleInputChange('profile', 'company', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Type
                      </label>
                      <select
                        value={customerData.profile.businessType}
                        onChange={(e) => handleInputChange('profile', 'businessType', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      >
                        <option value="Restaurant">Restaurant</option>
                        <option value="Cafe">Cafe</option>
                        <option value="Hotel">Hotel</option>
                        <option value="Catering">Catering</option>
                        <option value="Retail">Retail</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax ID / EIN
                      </label>
                      <input
                        type="text"
                        value={customerData.profile.taxId}
                        onChange={(e) => handleInputChange('profile', 'taxId', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end mt-8">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiSave className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Address Tab */}
              {activeTab === 'address' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Delivery Address</h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <FiEdit className="w-4 h-4 mr-2" />
                      {isEditing ? 'Cancel' : 'Edit Address'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={customerData.address.street}
                        onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={customerData.address.city}
                        onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={customerData.address.state}
                        onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={customerData.address.zipCode}
                        onChange={(e) => handleInputChange('address', 'zipCode', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={customerData.address.country}
                        onChange={(e) => handleInputChange('address', 'country', e.target.value)}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex justify-end mt-8">
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiSave className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save Address'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Receive order updates via email</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceToggle('emailNotifications')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          customerData.preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            customerData.preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                        <p className="text-sm text-gray-600">Receive text message alerts</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceToggle('smsNotifications')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          customerData.preferences.smsNotifications ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            customerData.preferences.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Promotional Emails</h3>
                        <p className="text-sm text-gray-600">Special offers and new products</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceToggle('promotionalEmails')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          customerData.preferences.promotionalEmails ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            customerData.preferences.promotionalEmails ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Order Updates</h3>
                        <p className="text-sm text-gray-600">Real-time order status changes</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceToggle('orderUpdates')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          customerData.preferences.orderUpdates ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            customerData.preferences.orderUpdates ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">Price Drop Alerts</h3>
                        <p className="text-sm text-gray-600">Get notified when prices decrease</p>
                      </div>
                      <button
                        onClick={() => handlePreferenceToggle('priceDropAlerts')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          customerData.preferences.priceDropAlerts ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            customerData.preferences.priceDropAlerts ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiSave className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              )}

              {/* Payment Tab */}
              {activeTab === 'payment' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
                    <button
                      onClick={handleAddPaymentMethod}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      <FiCreditCard className="w-4 h-4 mr-2" />
                      Add Payment Method
                    </button>
                  </div>

                  <div className="space-y-4">
                    {customerData.payment.cards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-lg">{getCardIcon(card.type)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {card.type.charAt(0).toUpperCase() + card.type.slice(1)} •••• {card.last4}
                            </p>
                            <p className="text-sm text-gray-600">Expires {card.expiry}</p>
                          </div>
                          {card.isDefault && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                              Default
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {!card.isDefault && (
                            <button
                              onClick={() => setDefaultPayment(card.id)}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Set Default
                            </button>
                          )}
                          <button
                            onClick={() => removePaymentMethod(card.id)}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-2">Billing Information</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Your default payment method will be used for all automatic charges.
                    </p>
                    <div className="text-sm text-gray-600">
                      <p>Next billing date: December 15, 2024</p>
                      <p>Current balance: $0.00</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

                  <div className="space-y-6">
                    <div className="p-6 border border-gray-200 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={customerData.security.currentPassword}
                              onChange={(e) => handleInputChange('security', 'currentPassword', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPassword ? (
                                <FiEyeOff className="w-4 h-4 text-gray-400" />
                              ) : (
                                <FiEye className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={customerData.security.newPassword}
                              onChange={(e) => handleInputChange('security', 'newPassword', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={customerData.security.confirmPassword}
                              onChange={(e) => handleInputChange('security', 'confirmPassword', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                            />
                          </div>
                        </div>

                        <button
                          onClick={handlePasswordChange}
                          disabled={saving}
                          className="flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <FiLock className="w-4 h-4 mr-2" />
                          {saving ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </div>

                    <div className="p-6 border border-gray-200 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-4">Login Security</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50">
                          Enable
                        </button>
                      </div>
                    </div>

                    <div className="p-6 border border-red-200 rounded-lg bg-red-50">
                      <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
                      <p className="text-sm text-red-700 mb-4">
                        Once you delete your account, there is no going back. Please be certain.
                      </p>
                      <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettings;