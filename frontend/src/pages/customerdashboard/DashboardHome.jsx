import { useState, useEffect, useRef } from 'react';
import { 
  FiShoppingCart, 
  FiPackage, 
  FiTruck, 
  FiDollarSign,
  FiStar,
  FiClock,
  FiCheckCircle,
  FiArrowRight,
  FiTrendingUp,
  FiMapPin,
  FiCalendar,
  FiMessageCircle,
  FiUsers,
  FiBox
} from 'react-icons/fi';
import ChatSidebar from './ChatSidebar';
import NewProductOfferPopup from './NewProductOfferPopup';

const DashboardHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewProductOffer, setShowNewProductOffer] = useState(false);
  const [currentOfferProduct, setCurrentOfferProduct] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Get current user from localStorage
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentUser(userData);

        const response = await fetch('http://localhost:5000/api/dashboard', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch dashboard data: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          setDashboardData(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Customer-focused stats - Now populated with real data
  const stats = dashboardData ? [
    { 
      icon: FiShoppingCart, 
      label: 'Active Orders', 
      value: dashboardData.stats.activeOrders.toString(), 
      change: `+${dashboardData.stats.newOrdersThisWeek} new`,
      description: 'In progress'
    },
    { 
      icon: FiUsers, 
      label: 'Total Orders', 
      value: dashboardData.stats.totalOrders.toString(), 
      change: `${dashboardData.stats.ordersThisMonth} this month`,
      description: 'All time orders'
    },
    { 
      icon: FiTruck, 
      label: 'Delivery Tracking', 
      value: dashboardData.stats.activeDeliveries.toString(), 
      change: `${dashboardData.stats.deliveriesToday} arriving today`,
      description: 'Active shipments'
    },
    { 
      icon: FiDollarSign, 
      label: 'Loyalty Points', 
      value: dashboardData.stats.loyaltyPoints.toLocaleString(), 
      change: `+${dashboardData.stats.pointsThisMonth} this month`,
      description: 'Available rewards'
    },
  ] : [];

  // Function to handle order placement with special offer
  const handleSpecialOfferOrder = (product) => {
    window.location.href = `/customer-dashboard/orders?product=${product.id}&offer=true`;
  };

  // Function to add a new product with offer (simulating wholesaler action)
  const addNewProductWithOffer = () => {
    // This function remains for demo purposes
    console.log('Add demo product clicked');
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      delivered: 'text-green-600 bg-green-50 border-green-200',
      shipped: 'text-blue-600 bg-blue-50 border-blue-200',
      processing: 'text-orange-600 bg-orange-50 border-orange-200',
      pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      cancelled: 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      delivered: FiCheckCircle,
      shipped: FiTruck,
      processing: FiClock,
      pending: FiClock,
      cancelled: FiBox
    };
    return icons[status] || FiClock;
  };

  // Format currency in KSH
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get progress percentage based on status
  const getOrderProgress = (status) => {
    const progressMap = {
      pending: 25,
      processing: 50,
      shipped: 75,
      delivered: 100,
      cancelled: 0
    };
    return progressMap[status] || 0;
  };

  // Get tracking message based on status
  const getTrackingMessage = (status) => {
    const messages = {
      pending: 'Order received, preparing for processing',
      processing: 'Processing your order in warehouse',
      shipped: 'In transit - On the way to you',
      delivered: 'Delivered successfully',
      cancelled: 'Order has been cancelled'
    };
    return messages[status] || 'Tracking information unavailable';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white rounded-xl p-8 border border-gray-200">
            <FiPackage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h3>
            <p className="text-gray-600 mb-4">We couldn't load your dashboard data at this time.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Main Dashboard Content - This stays fixed and doesn't move */}
      <div className="w-full">
        <div className="p-6 space-y-6">
          <NewProductOfferPopup 
            show={showNewProductOffer}
            product={currentOfferProduct}
            onClose={() => setShowNewProductOffer(false)}
            onOrder={handleSpecialOfferOrder}
          />
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {currentUser?.first_name || 'Customer'}!
              </h1>
              <p className="mt-1 text-sm text-gray-500">Manage your orders, track deliveries, and discover new products</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-4 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              <button 
                onClick={() => setShowChat(!showChat)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg"
              >
                <FiMessageCircle className="w-4 h-4 mr-2" />
                {showChat ? 'Close Chat' : 'Order via Chat'}
              </button>
              
              <button 
                onClick={addNewProductWithOffer}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <FiPackage className="w-4 h-4 mr-2" />
                Add Demo Product
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      {stat.change}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm font-medium text-gray-700 mb-1">{stat.label}</p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Charts & Orders */}
            <div className="xl:col-span-2 space-y-6">
              {/* Recommended Products */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Recommended for You</h2>
                  <button className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center">
                    View all <FiArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dashboardData.recommendedProducts.length > 0 ? (
                    dashboardData.recommendedProducts.map((product) => (
                      <div 
                        key={product.id} 
                        className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:shadow-sm transition-all hover:border-blue-200"
                      >
                        <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
                          {product.image || '📦'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
                            </div>
                            {product.isNew && (
                              <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                NEW
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-gray-900">
                                {formatCurrency(product.price)}
                              </span>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-sm text-gray-400 line-through">
                                  {formatCurrency(product.originalPrice)}
                                </span>
                              )}
                              {product.discount && (
                                <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                                  {product.discount}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <FiStar className="w-3 h-3 text-yellow-400 mr-1" />
                              {product.rating || '4.5'}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-green-600 flex items-center">
                              <FiTruck className="w-3 h-3 mr-1" />
                              {product.delivery || 'Standard delivery'}
                            </span>
                            <button 
                              className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <FiPackage className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No recommended products yet</p>
                      <p className="text-sm text-gray-400 mt-1">Start ordering to get personalized recommendations</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Orders with Progress Tracking */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                  <button 
                    onClick={() => window.location.href = '/customer-dashboard/orders'}
                    className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center"
                  >
                    View all <FiArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <div className="space-y-4">
                  {dashboardData.recentOrders.length > 0 ? (
                    dashboardData.recentOrders.map((order) => {
                      const StatusIcon = getStatusIcon(order.status);
                      const progress = getOrderProgress(order.status);
                      return (
                        <div key={order.id} className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition-colors">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                                <StatusIcon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {order.items && order.items.length > 0 
                                    ? `${order.items[0].product}${order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}`
                                    : 'Order items'
                                  }
                                </p>
                                <p className="text-xs text-gray-500">
                                  #{order.id} • {new Date(order.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {formatCurrency(order.total_amount)}
                            </span>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mb-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Order Progress</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  order.status === 'delivered' ? 'bg-green-500' :
                                  order.status === 'shipped' ? 'bg-blue-500' : 
                                  order.status === 'processing' ? 'bg-orange-500' : 'bg-yellow-500'
                                }`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600 flex items-center">
                              <FiMapPin className="w-3 h-3 mr-1" />
                              {getTrackingMessage(order.status)}
                            </span>
                            <button 
                              onClick={() => window.location.href = `/customer-dashboard/orders/${order.id}`}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Track Details
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <FiShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No recent orders</p>
                      <p className="text-sm text-gray-400 mt-1">Start shopping to see your orders here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Offers & Analytics */}
            <div className="space-y-6">
              {/* Current Offers */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Current Offers</h2>
                  <FiStar className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="space-y-4">
                  {dashboardData.currentOffers.length > 0 ? (
                    dashboardData.currentOffers.map((offer, index) => (
                      <div key={index} className="p-4 border border-gray-100 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{offer.title}</h3>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {offer.code}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{offer.description}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="flex items-center">
                            <FiCalendar className="w-3 h-3 mr-1" />
                            Valid until {offer.validUntil}
                          </span>
                          <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Apply
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No current offers</p>
                    </div>
                  )}
                </div>
              </div>

              {/* New Products Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">New Arrivals</h2>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FiPackage className="w-4 h-4 text-green-600" />
                  </div>
                </div>
                <div className="space-y-4">
                  {dashboardData.newArrivals.length > 0 ? (
                    dashboardData.newArrivals.map((product) => (
                      <div key={product.id} className="p-4 border border-green-200 rounded-lg bg-green-50">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl">
                            {product.image || '📦'}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900 text-sm">{product.name}</h3>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                            NEW
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-lg font-bold text-green-600">
                              {formatCurrency(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-400 line-through ml-2">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          {product.discount && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              {product.discount}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setCurrentOfferProduct(product);
                            setShowNewProductOffer(true);
                          }}
                          className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          View Product
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No new arrivals</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setShowChat(true)}
                    className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <FiMessageCircle className="w-6 h-6 text-blue-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Chat Order</span>
                  </button>
                  <button 
                    onClick={() => window.location.href = '/products'}
                    className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                  >
                    <FiPackage className="w-6 h-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Browse</span>
                  </button>
                  <button 
                    onClick={() => window.location.href = '/customer-dashboard/orders'}
                    className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                  >
                    <FiTruck className="w-6 h-6 text-purple-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Track</span>
                  </button>
                  <button className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors">
                    <FiTrendingUp className="w-6 h-6 text-orange-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Analytics</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Sidebar - Positioned absolutely over the content */}
      <div className={`fixed top-0 right-0 h-full transition-transform duration-300 z-50 ${
        showChat ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <ChatSidebar 
          show={showChat}
          onClose={() => setShowChat(false)}
        />
      </div>

      {/* Overlay when chat is open */}
      {showChat && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

export default DashboardHome;