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
  FiX
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import ChatSidebar from './ ChatSidebar';
import NewProductOfferPopup from './NewProductOfferPopup';

const DashboardHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewProductOffer, setShowNewProductOffer] = useState(false);
  const [currentOfferProduct, setCurrentOfferProduct] = useState(null);
  const [showChat, setShowChat] = useState(false);

  // New Products with Limited Time Offers
  const [newProductsWithOffers, setNewProductsWithOffers] = useState([
    {
      id: 1001,
      name: 'Organic Quinoa 20kg',
      category: 'Grains & Superfoods',
      price: '$129.99',
      originalPrice: '$159.99',
      discount: '18% OFF',
      rating: 4.9,
      delivery: 'Next day delivery',
      image: '🌾',
      isNew: true,
      offerExpiry: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      offerDescription: 'New Product Launch Offer!',
      wholesalePrice: '$89.99',
      normalPrice: '$159.99',
      daysRemaining: 10
    },
    {
      id: 1002,
      name: 'Cold-Pressed Olive Oil 10L',
      category: 'Premium Oils',
      price: '$79.99',
      originalPrice: '$99.99',
      discount: '20% OFF',
      rating: 4.8,
      delivery: 'Free shipping',
      image: '🫒',
      isNew: true,
      offerExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      offerDescription: 'Limited Time Wholesale Price',
      wholesalePrice: '$79.99',
      normalPrice: '$99.99',
      daysRemaining: 7
    }
  ]);

  // Check for new product offers on component mount
  useEffect(() => {
    const hasActiveOffers = newProductsWithOffers.some(product => 
      product.isNew && new Date(product.offerExpiry) > new Date()
    );
    
    if (hasActiveOffers) {
      const timer = setTimeout(() => {
        setShowNewProductOffer(true);
        const activeOffer = newProductsWithOffers.find(product => 
          product.isNew && new Date(product.offerExpiry) > new Date()
        );
        setCurrentOfferProduct(activeOffer);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [newProductsWithOffers]);

  // Update days remaining periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setNewProductsWithOffers(prevProducts => 
        prevProducts.map(product => ({
          ...product,
          daysRemaining: Math.max(0, Math.ceil((new Date(product.offerExpiry) - new Date()) / (24 * 60 * 60 * 1000)))
        }))
      );
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Customer-focused stats
  const stats = [
    { 
      icon: FiShoppingCart, 
      label: 'Active Orders', 
      value: '8', 
      change: '+2 new',
      description: 'In progress'
    },
    { 
      icon: FiPackage, 
      label: 'Items in Cart', 
      value: '12', 
      change: '+3 items',
      description: 'Ready to order'
    },
    { 
      icon: FiTruck, 
      label: 'Delivery Tracking', 
      value: '3', 
      change: '1 arriving today',
      description: 'Active shipments'
    },
    { 
      icon: FiDollarSign, 
      label: 'Loyalty Points', 
      value: '1,250', 
      change: '+150 this month',
      description: 'Available rewards'
    },
  ];

  // Recommended Products (including new products with offers)
  const recommendedProducts = [
    ...newProductsWithOffers.filter(product => product.isNew),
    {
      id: 1,
      name: 'Organic Basmati Rice 25kg',
      category: 'Grains & Rice',
      price: '$89.99',
      originalPrice: '$105.99',
      discount: '15% OFF',
      rating: 4.8,
      delivery: 'Next day delivery',
      image: '🍚',
      isNew: false
    },
    {
      id: 2,
      name: 'Premium Cooking Oil 5L',
      category: 'Cooking Essentials',
      price: '$34.99',
      originalPrice: '$38.99',
      discount: '10% OFF',
      rating: 4.6,
      delivery: 'Free shipping',
      image: '🛢️',
      isNew: false
    },
    {
      id: 3,
      name: 'Granulated Sugar 50kg',
      category: 'Sweeteners',
      price: '$129.99',
      originalPrice: '$149.99',
      discount: 'Bulk discount',
      rating: 4.7,
      delivery: '2-day delivery',
      image: '📦',
      isNew: false
    }
  ];

  // Recent Orders
  const recentOrders = [
    {
      id: '#ORD-7821',
      product: 'Wheat Flour 10kg x 4',
      status: 'delivered',
      date: '2 hours ago',
      amount: '$86.40',
      tracking: 'Delivered',
      progress: 100
    },
    {
      id: '#ORD-7819',
      product: 'Canned Tomatoes x 24',
      status: 'shipped',
      date: 'Yesterday',
      amount: '$67.20',
      tracking: 'In transit - Arriving tomorrow',
      progress: 75
    },
    {
      id: '#ORD-7815',
      product: 'Pasta Varieties Pack',
      status: 'processing',
      date: '2 days ago',
      amount: '$124.80',
      tracking: 'Preparing shipment',
      progress: 25
    }
  ];

  // Current Offers
  const currentOffers = [
    {
      title: 'Bulk Order Discount',
      description: 'Save 15% on orders over $500',
      validUntil: '2024-12-31',
      code: 'BULK15',
      type: 'discount'
    },
    {
      title: 'Free Shipping',
      description: 'Free delivery on all orders this month',
      validUntil: '2024-11-30',
      code: 'FREESHIP',
      type: 'shipping'
    },
    {
      title: 'Loyalty Bonus',
      description: 'Double points on all purchases',
      validUntil: '2024-11-15',
      code: 'AUTOMATIC',
      type: 'loyalty'
    }
  ];

  // Order Status Chart Data
  const orderStatusData = [
    { name: 'Delivered', value: 65, color: '#10b981' },
    { name: 'In Transit', value: 20, color: '#3b82f6' },
    { name: 'Processing', value: 15, color: '#f59e0b' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      delivered: 'text-green-600 bg-green-50 border-green-200',
      shipped: 'text-blue-600 bg-blue-50 border-blue-200',
      processing: 'text-orange-600 bg-orange-50 border-orange-200'
    };
    return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      delivered: FiCheckCircle,
      shipped: FiTruck,
      processing: FiClock
    };
    return icons[status] || FiClock;
  };

  // Function to handle order placement with special offer
  const handleSpecialOfferOrder = (product) => {
    window.location.href = `/customer-dashboard/orders?product=${product.id}&offer=true`;
  };

  // Function to add a new product with offer (simulating wholesaler action)
  const addNewProductWithOffer = () => {
    const newProduct = {
      id: Date.now(),
      name: 'Artisanal Honey 15kg',
      category: 'Natural Sweeteners',
      price: '$67.99',
      originalPrice: '$84.99',
      discount: '20% OFF',
      rating: 4.9,
      delivery: 'Free shipping',
      image: '🍯',
      isNew: true,
      offerExpiry: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      offerDescription: 'New Product Launch Special!',
      wholesalePrice: '$67.99',
      normalPrice: '$84.99',
      daysRemaining: 10
    };

    setNewProductsWithOffers(prev => [newProduct, ...prev]);
    setCurrentOfferProduct(newProduct);
    setShowNewProductOffer(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Dashboard Content */}
      <div className={`flex-1 transition-all duration-300 ${showChat ? 'mr-80' : 'mr-0'}`}>
        <div className="p-6 space-y-6">
          <NewProductOfferPopup 
            show={showNewProductOffer}
            product={currentOfferProduct}
            onClose={() => setShowNewProductOffer(false)}
            onOrder={handleSpecialOfferOrder}
          />
          
          <ChatSidebar 
            show={showChat}
            onClose={() => setShowChat(false)}
          />

          {/* Header */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Customer Dashboard</h1>
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
                  {recommendedProducts.map((product) => (
                    <div 
                      key={product.id} 
                      className={`flex items-center space-x-4 p-4 border rounded-lg hover:shadow-sm transition-all relative ${
                        product.isNew 
                          ? 'border-green-300 bg-green-50 border-2' 
                          : 'border-gray-100 hover:border-blue-200'
                      }`}
                    >
                      {product.isNew && (
                        <div className="absolute -top-2 -left-2">
                          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                            NEW
                          </span>
                        </div>
                      )}
                      <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
                        {product.image}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
                          </div>
                          {product.isNew && (
                            <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              {product.daysRemaining}d left
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">{product.price}</span>
                            <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded ${
                              product.isNew 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {product.discount}
                            </span>
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <FiStar className="w-3 h-3 text-yellow-400 mr-1" />
                            {product.rating}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-green-600 flex items-center">
                            <FiTruck className="w-3 h-3 mr-1" />
                            {product.delivery}
                          </span>
                          <button 
                            onClick={() => product.isNew && setCurrentOfferProduct(product)}
                            className={`text-xs px-3 py-1.5 rounded transition-colors ${
                              product.isNew
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {product.isNew ? 'Special Offer' : 'Add to Cart'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders with Progress Tracking */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                  <button className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center">
                    View all <FiArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                <div className="space-y-4">
                  {recentOrders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                      <div key={order.id} className="p-4 border border-gray-100 rounded-lg hover:border-blue-200 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${getStatusColor(order.status)}`}>
                              <StatusIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{order.product}</p>
                              <p className="text-xs text-gray-500">{order.id} • {order.date}</p>
                            </div>
                          </div>
                          <span className="text-sm font-semibold text-gray-900">{order.amount}</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Order Progress</span>
                            <span>{order.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                order.status === 'delivered' ? 'bg-green-500' :
                                order.status === 'shipped' ? 'bg-blue-500' : 'bg-orange-500'
                              }`}
                              style={{ width: `${order.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600 flex items-center">
                            <FiMapPin className="w-3 h-3 mr-1" />
                            {order.tracking}
                          </span>
                          <button className="text-blue-600 hover:text-blue-700 font-medium">
                            Track Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
                  {currentOffers.map((offer, index) => (
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
                  ))}
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
                  {newProductsWithOffers
                    .filter(product => product.isNew)
                    .map((product) => (
                      <div key={product.id} className="p-4 border border-green-200 rounded-lg bg-green-50">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xl">
                            {product.image}
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
                            <span className="text-lg font-bold text-green-600">{product.price}</span>
                            <span className="text-sm text-gray-400 line-through ml-2">{product.originalPrice}</span>
                          </div>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            {product.discount}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                          <span>Offer ends in {product.daysRemaining} days</span>
                          <span>After: {product.normalPrice}</span>
                        </div>
                        <button
                          onClick={() => {
                            setCurrentOfferProduct(product);
                            setShowNewProductOffer(true);
                          }}
                          className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          View Special Offer
                        </button>
                      </div>
                    ))}
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
                  <button className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors">
                    <FiPackage className="w-6 h-6 text-green-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Browse</span>
                  </button>
                  <button className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors">
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
    </div>
  );
};

export default DashboardHome;