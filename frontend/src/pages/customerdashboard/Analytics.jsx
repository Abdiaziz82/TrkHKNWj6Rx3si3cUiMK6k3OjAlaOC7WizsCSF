import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  Eye,
  Clock,
  Calendar,
  Download,
  Filter,
  MoreVertical,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

// Mock data for charts and metrics
const analyticsData = {
  overview: {
    visitors: { current: 12480, previous: 9830, change: 27 },
    customers: { current: 892, previous: 745, change: 19.7 },
    orders: { current: 347, previous: 298, change: 16.4 },
    revenue: { current: 12480, previous: 10560, change: 18.2 }
  },
  trafficSources: [
    { source: 'Organic Search', visitors: 5240, percentage: 42 },
    { source: 'Direct', visitors: 3120, percentage: 25 },
    { source: 'Social Media', visitors: 2480, percentage: 20 },
    { source: 'Email', visitors: 1240, percentage: 10 },
    { source: 'Referral', visitors: 400, percentage: 3 }
  ],
  monthlyRevenue: [
    { month: 'Jan', revenue: 8500 },
    { month: 'Feb', revenue: 9200 },
    { month: 'Mar', revenue: 7800 },
    { month: 'Apr', revenue: 11200 },
    { month: 'May', revenue: 10500 },
    { month: 'Jun', revenue: 12480 }
  ],
  topProducts: [
    { name: 'Wireless Headphones', sales: 234, revenue: 4680 },
    { name: 'Smart Watch', sales: 189, revenue: 5670 },
    { name: 'Laptop Stand', sales: 156, revenue: 2340 },
    { name: 'USB-C Hub', sales: 143, revenue: 2860 },
    { name: 'Mechanical Keyboard', sales: 128, revenue: 3840 }
  ],
  userActivity: [
    { time: '12:00 AM', visitors: 120 },
    { time: '4:00 AM', visitors: 80 },
    { time: '8:00 AM', visitors: 450 },
    { time: '12:00 PM', visitors: 980 },
    { time: '4:00 PM', visitors: 760 },
    { time: '8:00 PM', visitors: 520 }
  ]
};

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeMetric, setActiveMetric] = useState('visitors');

  const MetricCard = ({ title, value, change, icon: Icon, trend }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <span className={`flex items-center text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
          {change}%
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );

  const TrafficSourceItem = ({ source, visitors, percentage }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center">
        <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
        <span className="text-gray-700 font-medium">{source}</span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-gray-900 font-medium w-16 text-right">
          {visitors.toLocaleString()}
        </span>
        <span className="text-gray-500 w-12 text-right">{percentage}%</span>
      </div>
    </div>
  );

  const ProductItem = ({ name, sales, revenue, index }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{name}</h4>
          <p className="text-gray-500 text-sm">{sales} sales</p>
        </div>
      </div>
      <span className="text-gray-900 font-medium">${revenue.toLocaleString()}</span>
    </div>
  );

  const BarChart = ({ data, height = 200 }) => {
    const maxValue = Math.max(...data.map(item => item.revenue || item.visitors));
    
    return (
      <div className="flex items-end justify-between space-x-2" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const barHeight = ((item.revenue || item.visitors) / maxValue) * (height - 40);
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                style={{ height: `${barHeight}px` }}
              ></div>
              <span className="text-xs text-gray-500 mt-2">{item.month || item.time}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Track and analyze your business performance</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Visitors"
          value={analyticsData.overview.visitors.current}
          change={analyticsData.overview.visitors.change}
          icon={Eye}
          trend="up"
        />
        <MetricCard
          title="New Customers"
          value={analyticsData.overview.customers.current}
          change={analyticsData.overview.customers.change}
          icon={Users}
          trend="up"
        />
        <MetricCard
          title="Total Orders"
          value={analyticsData.overview.orders.current}
          change={analyticsData.overview.orders.change}
          icon={ShoppingCart}
          trend="up"
        />
        <MetricCard
          title="Total Revenue"
          value={analyticsData.overview.revenue.current}
          change={analyticsData.overview.revenue.change}
          icon={DollarSign}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Last 6 months</span>
            </div>
          </div>
          <BarChart data={analyticsData.monthlyRevenue} height={200} />
          <div className="flex justify-center mt-4 space-x-6">
            {analyticsData.monthlyRevenue.slice(-3).map((month, index) => (
              <div key={index} className="text-center">
                <p className="text-2xl font-bold text-gray-900">${month.revenue.toLocaleString()}</p>
                <p className="text-gray-500 text-sm">{month.month}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Traffic Sources</h3>
            <button className="text-gray-500 hover:text-gray-700">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-1">
            {analyticsData.trafficSources.map((source, index) => (
              <TrafficSourceItem key={index} {...source} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
            <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View all
            </button>
          </div>
          <div className="space-y-1">
            {analyticsData.topProducts.map((product, index) => (
              <ProductItem key={index} {...product} index={index} />
            ))}
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Activity</h3>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">24h pattern</span>
            </div>
          </div>
          <BarChart data={analyticsData.userActivity} height={150} />
          <div className="flex justify-between mt-4 text-sm text-gray-600">
            <span>Midnight</span>
            <span>Evening</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <TrendingUp className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Conversion Rate</h3>
          <p className="text-3xl font-bold">4.8%</p>
          <p className="text-blue-100 text-sm mt-2">+2.1% from last month</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <Users className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Avg. Session</h3>
          <p className="text-3xl font-bold">3m 24s</p>
          <p className="text-green-100 text-sm mt-2">+45s from last month</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <ShoppingCart className="w-8 h-8 mb-3" />
          <h3 className="text-lg font-semibold mb-2">Bounce Rate</h3>
          <p className="text-3xl font-bold">28.3%</p>
          <p className="text-purple-100 text-sm mt-2">-5.2% from last month</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;