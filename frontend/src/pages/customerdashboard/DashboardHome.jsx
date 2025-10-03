import { useState } from 'react';
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
  FiBox,
  FiMapPin,
  FiCalendar
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

const DashboardHome = () => {
  const [searchQuery, setSearchQuery] = useState('');

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

  // Recommended Products
  const recommendedProducts = [
    {
      id: 1,
      name: 'Organic Basmati Rice 25kg',
      category: 'Grains & Rice',
      price: '$89.99',
      originalPrice: '$105.99',
      discount: '15% OFF',
      rating: 4.8,
      delivery: 'Next day delivery',
      image: '🍚'
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
      image: '🛢️'
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
      image: '📦'
    },
    {
      id: 4,
      name: 'Assorted Spices Pack',
      category: 'Spices & Seasonings',
      price: '$45.50',
      originalPrice: '$56.90',
      discount: '20% OFF',
      rating: 4.9,
      delivery: 'Same day',
      image: '🌶️'
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
    },
    {
      id: '#ORD-7809',
      product: 'Beverage Assortment',
      status: 'delivered',
      date: '1 week ago',
      amount: '$215.50',
      tracking: 'Delivered',
      progress: 100
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

  // Monthly Spending Data
  const spendingData = [
    { month: 'Jan', amount: 12500 },
    { month: 'Feb', amount: 11800 },
    { month: 'Mar', amount: 14200 },
    { month: 'Apr', amount: 15600 },
    { month: 'May', amount: 13800 },
    { month: 'Jun', amount: 16200 },
    { month: 'Jul', amount: 14800 },
    { month: 'Aug', amount: 17100 },
    { month: 'Sep', amount: 15800 },
    { month: 'Oct', amount: 16500 },
    { month: 'Nov', amount: 18200 },
    { month: 'Dec', amount: 19500 }
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

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            Spending: ${payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 font">
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
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <FiShoppingCart className="w-4 h-4 mr-2" />
            New Order
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
                <div key={product.id} className="flex items-center space-x-4 p-4 border border-gray-100 rounded-lg hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center text-2xl">
                    {product.image}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">{product.price}</span>
                        <span className="text-sm text-gray-400 line-through">{product.originalPrice}</span>
                        <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">{product.discount}</span>
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
                      <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors">
                        Add to Cart
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

          {/* Order Analytics */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Analytics</h2>
            <div className="h-48 mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {orderStatusData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors">
                <FiShoppingCart className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm font-medium text-gray-700">New Order</span>
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
  );
};

export default DashboardHome;