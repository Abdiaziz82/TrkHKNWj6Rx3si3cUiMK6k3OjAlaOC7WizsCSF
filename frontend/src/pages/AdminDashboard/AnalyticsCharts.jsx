import React from "react";
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown,
  Calendar,
  Package,
  Eye
} from "lucide-react";

// Metric Card Component
const MetricCard = ({ title, value, growth, icon: Icon, bgColor, formatCurrency }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-xl font-bold text-gray-900 mt-1">
          {title.includes('Sales') || title.includes('Order Value') ? formatCurrency(value) : value}
        </p>
        {growth !== 0 && (
          <div className={`flex items-center space-x-1 mt-1 ${
            growth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {growth >= 0 ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(growth).toFixed(1)}%
            </span>
          </div>
        )}
        {growth === 0 && (
          <div className="text-sm text-gray-500 mt-1">Per order</div>
        )}
      </div>
      <div className={`p-2 ${bgColor} rounded-lg`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

// Bar Chart Component
const BarChart = ({ data, metric, formatCurrency }) => {
  const maxValue = Math.max(...data.map(item => item[metric]));
  
  return (
    <div className="flex items-end justify-between h-48 space-x-2 mt-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className="text-xs text-gray-500 mb-1">{item.month}</div>
          <div
            className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 cursor-pointer"
            style={{ 
              height: `${(item[metric] / maxValue) * 100}%`,
              minHeight: '8px'
            }}
            title={`${item.month}: ${formatCurrency(item[metric])}`}
          />
          <div className="text-xs text-gray-600 mt-1">
            {metric === 'sales' ? formatCurrency(item[metric]).replace('TZS', '').trim() : item[metric]}
          </div>
        </div>
      ))}
    </div>
  );
};

// Forecast Chart Component
const ForecastChart = ({ data, formatCurrency }) => {
  const maxValue = Math.max(...data.map(item => item.forecast));
  
  return (
    <div className="flex items-end justify-between h-48 space-x-2 mt-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div className="text-xs text-gray-500 mb-1">{item.month.split(' ')[0]}</div>
          <div
            className="w-full bg-gradient-to-t from-purple-500 to-purple-600 rounded-t-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 cursor-pointer"
            style={{ 
              height: `${(item.forecast / maxValue) * 100}%`,
              minHeight: '8px'
            }}
            title={`${item.month}: ${formatCurrency(item.forecast)} (${item.confidence}% confidence)`}
          />
          <div className="text-xs text-gray-600 mt-1">
            {formatCurrency(item.forecast).replace('TZS', '').trim()}
          </div>
          <div className={`text-xs mt-1 ${
            item.confidence >= 80 ? 'text-green-600' :
            item.confidence >= 70 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {item.confidence}%
          </div>
        </div>
      ))}
    </div>
  );
};

// Performance Item Component
const PerformanceItem = ({ item, icon: Icon, bgColor, formatCurrency, isProduct = false }) => (
  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
    <div className="flex items-center space-x-3">
      <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="font-semibold text-gray-900 text-sm">
          {isProduct ? item.product : item.name}
        </div>
        <div className="text-xs text-gray-500">
          {isProduct ? `Stock: ${item.stock} units` : item.location}
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className="font-semibold text-gray-900 text-sm">
        {formatCurrency(isProduct ? item.sales : item.value)}
      </div>
      <div className={`flex items-center space-x-1 text-xs ${
        item.growth >= 0 ? 'text-green-600' : 'text-red-600'
      }`}>
        {item.growth >= 0 ? (
          <ArrowUp className="w-3 h-3" />
        ) : (
          <ArrowDown className="w-3 h-3" />
        )}
        <span>{Math.abs(item.growth)}%</span>
      </div>
    </div>
  </div>
);

// Main Analytics Charts Component
const AnalyticsCharts = (props) => {
  const {
    metrics,
    filteredSalesData,
    forecastData,
    productPerformance,
    retailerPerformance,
    timeRange,
    setTimeRange,
    selectedMetric,
    setSelectedMetric,
    formatCurrency
  } = props;

  const metricConfigs = [
    {
      title: "Total Sales",
      value: metrics.totalSales,
      growth: metrics.salesGrowth,
      icon: DollarSign,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "Total Orders",
      value: metrics.totalOrders,
      growth: metrics.ordersGrowth,
      icon: ShoppingCart,
      bgColor: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Active Customers",
      value: metrics.totalCustomers,
      growth: metrics.customersGrowth,
      icon: Users,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Avg Order Value",
      value: metrics.avgOrderValue,
      growth: 0,
      icon: TrendingUp,
      bgColor: "bg-yellow-100",
      iconColor: "text-yellow-600"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricConfigs.map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            growth={metric.growth}
            icon={metric.icon}
            bgColor={metric.bgColor}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales Performance Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Performance</h3>
            <div className="flex items-center space-x-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="3m">Last 3 Months</option>
                <option value="6m">Last 6 Months</option>
                <option value="1y">Last 12 Months</option>
              </select>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sales">Sales</option>
                <option value="orders">Orders</option>
                <option value="customers">Customers</option>
              </select>
            </div>
          </div>
          <BarChart data={filteredSalesData} metric={selectedMetric} formatCurrency={formatCurrency} />
        </div>

        {/* Sales Forecast */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Forecast</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Next 5 Months</span>
            </div>
          </div>
          <ForecastChart data={forecastData} formatCurrency={formatCurrency} />
          <div className="mt-4 text-sm text-gray-600">
            <p>AI-powered predictions with confidence scores. Higher scores indicate more reliable forecasts.</p>
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Product Performance */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
          <div className="space-y-3">
            {productPerformance.map((product, index) => (
              <PerformanceItem
                key={index}
                item={product}
                icon={Package}
                bgColor="bg-blue-100"
                formatCurrency={formatCurrency}
                isProduct={true}
              />
            ))}
          </div>
        </div>

        {/* Retailer Performance */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Retailers</h3>
          <div className="space-y-3">
            {retailerPerformance.map((retailer, index) => (
              <PerformanceItem
                key={index}
                item={retailer}
                icon={Users}
                bgColor="bg-green-100"
                formatCurrency={formatCurrency}
                isProduct={false}
              />
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Insights & Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h4 className="font-semibold text-blue-900 text-sm">Growth Opportunity</h4>
            </div>
            <p className="text-blue-800 text-sm">
              Rice sales show 15% growth. Consider increasing stock levels by 20% to meet rising demand.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-4 h-4 text-yellow-600" />
              <h4 className="font-semibold text-yellow-900 text-sm">Attention Needed</h4>
            </div>
            <p className="text-yellow-800 text-sm">
              Sugar sales declined by 2%. Review pricing strategy and consider promotional offers.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-green-600" />
              <h4 className="font-semibold text-green-900 text-sm">Customer Insight</h4>
            </div>
            <p className="text-green-800 text-sm">
              Customer base grew by 18% this quarter. Focus on retention strategies for new customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;