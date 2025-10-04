import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiPackage, 
  FiShoppingCart,
  FiCreditCard,
  FiUsers,
  FiBarChart2,
  FiTrendingUp,
  FiUser,
  FiSettings
} from 'react-icons/fi';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  const menuSections = [
    {
      title: null,
      items: [
        { path: '/admin-dashboard', icon: FiHome, label: 'Dashboard' }
      ]
    },
    {
      title: 'BUSINESS OPERATIONS',
      items: [
        { path: '/admin-dashboard/inventory-management', icon: FiPackage, label: 'Inventory Management' },
        { path: '/admin-dashboard/orders-management', icon: FiShoppingCart, label: 'Orders Management' },
        { path: '/admin-dashboard/ledger-payments', icon: FiCreditCard, label: 'Ledger & Payments' },
        { path: '/admin-dashboard/retailer-profiles', icon: FiUsers, label: 'Retailer Profiles' }
      ]
    },
    {
      title: 'ANALYTICS & GROWTH',
      items: [
        { path: '/admin-dashboard/analytics-forecasting', icon: FiBarChart2, label: 'Analytics & Forecasting' },
        { path: '/admin-dashboard/digital-marketing-tools', icon: FiTrendingUp, label: 'Digital Marketing Tools' }
      ]
    },
    {
      title: 'ACCOUNT',
      items: [
        { path: '/admin-dashboard/profile', icon: FiUser, label: 'Profile' },
        { path: '/admin-dashboard/settings', icon: FiSettings, label: 'Settings' }
      ]
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden font"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        font
        w-62 bg-white border-r border-gray-200 transform
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-screen
      `}>
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200">
 <div className="flex items-center space-x-3">
    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    </div>
    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
      SmartERP
    </h1>
  </div>
          
          {/* Close button for mobile */}
          <button 
            onClick={toggleSidebar}
            className="lg:hidden absolute top-4 right-4 p-1.5 rounded hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation - Full height utilization */}
        <div className="flex-1 py-4">
          <nav className="space-y-6">
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {/* Section Title */}
                {section.title && (
                  <div className="px-6 mb-2">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                )}
                
                {/* Menu Items */}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`
                          flex items-center px-6 py-3 transition-colors duration-150
                          ${active 
                            ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                        onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                      >
                        <Icon className={`w-4 h-4 mr-3 flex-shrink-0 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">Enterprise </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;