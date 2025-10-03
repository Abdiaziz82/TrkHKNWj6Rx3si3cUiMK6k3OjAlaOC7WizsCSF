// Settings.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const [activeModal, setActiveModal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a specific modal to open from navigation
    const selectedSetting = localStorage.getItem('selectedSetting');
    if (selectedSetting) {
      setActiveModal(selectedSetting);
      localStorage.removeItem('selectedSetting'); // Clean up
    }
  }, []);

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
          </div>
          <p className="text-gray-600 text-lg ml-12">
            Manage your account preferences and security settings
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => setActiveModal('edit-profile')}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-purple-200 hover:transform hover:-translate-y-1 text-left group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors duration-200">
              <span className="text-2xl">✏️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Edit Profile</h3>
            <p className="text-gray-600 text-sm">Update your personal information and contact details</p>
          </button>

          <button
            onClick={() => setActiveModal('change-password')}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-blue-200 hover:transform hover:-translate-y-1 text-left group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-200">
              <span className="text-2xl">🔑</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Change Password</h3>
            <p className="text-gray-600 text-sm">Update your password and security preferences</p>
          </button>

          <button
            onClick={() => setActiveModal('account-settings')}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-green-200 hover:transform hover:-translate-y-1 text-left group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors duration-200">
              <span className="text-2xl">⚙️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Settings</h3>
            <p className="text-gray-600 text-sm">Manage notifications and account preferences</p>
          </button>
        </div>

        {/* Additional Settings Sections */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Settings</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200">
              <div>
                <h3 className="font-semibold text-gray-900">Privacy & Security</h3>
                <p className="text-gray-600 text-sm">Manage your privacy settings and data</p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
            
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200">
              <div>
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <p className="text-gray-600 text-sm">Configure your notification preferences</p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
            
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors duration-200">
              <div>
                <h3 className="font-semibold text-gray-900">Billing & Subscription</h3>
                <p className="text-gray-600 text-sm">Manage your billing information</p>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'edit-profile' && (
        <Modal title="Edit Profile" onClose={closeModal}>
          <EditProfileForm onClose={closeModal} />
        </Modal>
      )}
      
      {activeModal === 'change-password' && (
        <Modal title="Change Password" onClose={closeModal}>
          <ChangePasswordForm onClose={closeModal} />
        </Modal>
      )}
      
      {activeModal === 'account-settings' && (
        <Modal title="Account Settings" onClose={closeModal}>
          <AccountSettingsForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}

/* ---------- Reusable Modal ---------- */
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in-90 zoom-in-90">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl transition-colors duration-200"
        >
          &times;
        </button>
      </div>
      {children}
    </div>
  </div>
);

/* ---------- Edit Profile Form ---------- */
const EditProfileForm = ({ onClose }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [form, setForm] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    phone_number: user?.phone_number || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated profile:", form);
    // Update user in localStorage and potentially make API call
    const updatedUser = { ...user, ...form };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
        <input
          type="text"
          value={form.first_name}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
        <input
          type="text"
          value={form.last_name}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
        <input
          type="text"
          value={form.phone_number}
          onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors duration-200"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

/* ---------- Change Password Form ---------- */
const ChangePasswordForm = ({ onClose }) => {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (!form.old_password) {
      newErrors.old_password = "Current password is required";
    }
    if (!form.new_password) {
      newErrors.new_password = "New password is required";
    } else if (form.new_password.length < 6) {
      newErrors.new_password = "Password must be at least 6 characters";
    }
    if (form.new_password !== form.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log("Password changed:", form);
    // 🔹 Call Flask backend API here
    // For now, just close the modal
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
        <input
          type="password"
          placeholder="Enter current password"
          value={form.old_password}
          onChange={(e) => {
            setForm({ ...form, old_password: e.target.value });
            setErrors({ ...errors, old_password: '' });
          }}
          className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.old_password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.old_password && (
          <p className="text-red-500 text-sm mt-1">{errors.old_password}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          value={form.new_password}
          onChange={(e) => {
            setForm({ ...form, new_password: e.target.value });
            setErrors({ ...errors, new_password: '' });
          }}
          className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.new_password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.new_password && (
          <p className="text-red-500 text-sm mt-1">{errors.new_password}</p>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
        <input
          type="password"
          placeholder="Confirm new password"
          value={form.confirm_password}
          onChange={(e) => {
            setForm({ ...form, confirm_password: e.target.value });
            setErrors({ ...errors, confirm_password: '' });
          }}
          className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            errors.confirm_password ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.confirm_password && (
          <p className="text-red-500 text-sm mt-1">{errors.confirm_password}</p>
        )}
      </div>
      
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
        >
          Update Password
        </button>
      </div>
    </form>
  );
};

/* ---------- Account Settings Form ---------- */
const AccountSettingsForm = ({ onClose }) => {
  const [settings, setSettings] = useState({
    email_notifications: true,
    sms_notifications: false,
    dark_mode: false,
    auto_logout: true,
    language: 'en',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Account settings updated:", settings);
    // 🔹 Save to backend or localStorage
    localStorage.setItem('userSettings', JSON.stringify(settings));
    onClose();
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Notification Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Email Notifications</label>
              <p className="text-sm text-gray-500">Receive updates via email</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('email_notifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.email_notifications ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.email_notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">SMS Notifications</label>
              <p className="text-sm text-gray-500">Receive updates via SMS</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('sms_notifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.sms_notifications ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.sms_notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Appearance Settings */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Dark Mode</label>
              <p className="text-sm text-gray-500">Switch to dark theme</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('dark_mode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.dark_mode ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dark_mode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-700">Auto Logout</label>
              <p className="text-sm text-gray-500">Automatically logout after inactivity</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('auto_logout')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.auto_logout ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.auto_logout ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors duration-200"
        >
          Save Settings
        </button>
      </div>
    </form>
  );
};

export default Settings;