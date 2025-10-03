import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  RiDashboardLine,
  RiShoppingBagLine,
  RiShoppingCartLine,
  RiWallet3Line,
  RiMessage2Line,
  RiBarChartLine,
  RiUserLine,
  RiSettings3Line
} from 'react-icons/ri';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Important for sending cookies
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCurrentUser(data.user);
          }
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  const menuItems = [
    { 
      path: '/customer-dashboard', 
      icon: RiDashboardLine, 
      label: 'Dashboard Overview',
      description: 'System metrics & KPIs'
    },
    
    { 
      path: '/customer-dashboard/orders', 
      icon: RiShoppingCartLine, 
      label: 'Orders',
      description: 'Order processing'
    },
    { 
      path: '/customer-dashboard/payments', 
      icon: RiWallet3Line, 
      label: 'Payments',
      description: 'Transaction history'
    },
    { 
      path: '/customer-dashboard/messages', 
      icon: RiMessage2Line, 
      label: 'Messages',
      description: 'Communication hub'
    },
    { 
      path: '/customer-dashboard/analytics', 
      icon: RiBarChartLine, 
      label: 'Analytics',
      description: 'Business intelligence'
    },
    { 
      path: '/customer-dashboard/profile', 
      icon: RiUserLine, 
      label: 'Profile',
      description: 'Account management'
    },
    { 
      path: '/customer-dashboard/settings', 
      icon: RiSettings3Line, 
      label: 'Settings',
      description: 'System configuration'
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Function to get user initials
  const getUserInitials = (user) => {
    if (!user) return 'US';
    const { first_name, last_name, email } = user;
    if (first_name && last_name) {
      return `${first_name.charAt(0)}${last_name.charAt(0)}`.toUpperCase();
    }
    if (first_name) {
      return first_name.charAt(0).toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return 'US';
  };

  // Function to get display name
  const getDisplayName = (user) => {
    if (!user) return 'Loading...';
    const { first_name, last_name, email } = user;
    if (first_name && last_name) {
      return `${first_name} ${last_name}`;
    }
    if (first_name) {
      return first_name;
    }
    return email || 'User';
  };

  // Function to get display email
  const getDisplayEmail = (user) => {
    if (!user) return 'loading...';
    return user.email || 'user@example.com';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-50
        font
        h-screen w-72 
        bg-white
        border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
        overflow-y-auto overflow-x-hidden
        scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent
      `}>
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                    <span className="text-white font-semibold text-base">EF</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h1 className="text-base font-semibold text-gray-900 tracking-tight">EnterpriseFlow</h1>
                  <p className="text-xs text-gray-500 mt-0.5">Customer Portal v2.0</p>
                </div>
              </div>
              <button 
                onClick={toggleSidebar}
                className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-4">
          <nav className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <React.Fragment key={item.path}>
                  <Link
                    to={item.path}
                    className={`
                      relative group flex items-center px-3 py-2.5 rounded-lg
                      transition-all duration-200 ease-in-out
                      ${active 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  >
                    {/* Active Indicator */}
                    {active && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />
                    )}
                    
                    {/* Icon Container */}
                    <div className={`
                      flex items-center justify-center w-9 h-9 rounded-lg mr-3
                      transition-all duration-200
                      ${active 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1">
                      <span className={`
                        block text-sm font-medium
                        ${active ? 'text-indigo-700' : 'text-gray-900'}
                      `}>
                        {item.label}
                      </span>
                      <span className={`
                        block text-xs mt-0.5
                        ${active ? 'text-indigo-600' : 'text-gray-500'}
                      `}>
                        {item.description}
                      </span>
                    </div>

                    {/* Notification Badge (example for messages) */}
                    {item.path === '/customer-dashboard/messages' && (
                      <div className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-medium rounded-full">
                        3
                      </div>
                    )}
                  </Link>

                  {/* Separator after specific items */}
                  {(index === 0 || index === 3 || index === 5) && (
                    <div className="my-3 px-3">
                      <div className="h-px bg-gray-200"></div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200">
          <div className="p-4">
            {/* User Profile Section */}
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <span className="text-white font-medium text-sm">
                      {getUserInitials(currentUser)}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {loading ? 'Loading...' : getDisplayName(currentUser)}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {loading ? 'loading...' : getDisplayEmail(currentUser)}
                </p>
              </div>
              <button className="p-1.5 rounded-md hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Version Info */}
            <div className="mt-3 px-3 py-2">
              <p className="text-xs text-gray-400 text-center">
                © 2025 EnterpriseFlow ·
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;