import React, { useState } from 'react';
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiTrendingUp,
  FiActivity,
  FiAlertTriangle,
  FiClock,
  FiCheckCircle,
  FiCreditCard,
  FiSearch,
  FiBarChart2
} from 'react-icons/fi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

/*
  AdminDashboardHome.jsx
  - Wholesaler-focused dashboard
  - React + TailwindCSS + React Icons + Recharts
  - Professional, responsive, and focused on SME pain points
*/

const formatCurrency = (v) =>
  v.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const statusBadge = (level) => {
  if (level === 'critical') return 'text-red-700 bg-red-50';
  if (level === 'warning') return 'text-orange-700 bg-orange-50';
  return 'text-green-700 bg-green-50';
};

const StatCard = ({ Icon, title, value, hint, colorClass = 'text-gray-700' }) => (
  <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className={`text-2xl font-semibold ${colorClass} mt-1`}>{value}</p>
        {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      </div>
      <div className="p-3 rounded-lg bg-gray-50">
        <Icon className="w-6 h-6 text-gray-600" />
      </div>
    </div>
  </div>
);

const AdminDashboardHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('All');

  const stats = [
    { Icon: FiDollarSign, title: 'Revenue (30d)', value: formatCurrency(89245), hint: '+18% vs last month', colorClass: 'text-gray-900' },
    { Icon: FiShoppingCart, title: 'Orders (30d)', value: '2,341', hint: '+23% growth', colorClass: 'text-gray-900' },
    { Icon: FiPackage, title: 'SKUs', value: '5,678', hint: 'Active products', colorClass: 'text-gray-900' },
    { Icon: FiTrendingUp, title: 'Avg Order Value', value: formatCurrency(38), hint: '+4% vs last period', colorClass: 'text-gray-900' }
  ];

  // Monthly Sales Data
  const monthlySalesData = [
    { month: 'Jan', revenue: 125000, profit: 45000, orders: 1850 },
    { month: 'Feb', revenue: 118000, profit: 42000, orders: 1720 },
    { month: 'Mar', revenue: 142000, profit: 52000, orders: 1980 },
    { month: 'Apr', revenue: 156000, profit: 58000, orders: 2150 },
    { month: 'May', revenue: 138000, profit: 49000, orders: 1920 },
    { month: 'Jun', revenue: 162000, profit: 61000, orders: 2280 },
    { month: 'Jul', revenue: 148000, profit: 54000, orders: 2050 },
    { month: 'Aug', revenue: 171000, profit: 65000, orders: 2380 },
    { month: 'Sep', revenue: 158000, profit: 59000, orders: 2210 },
    { month: 'Oct', revenue: 165000, profit: 62000, orders: 2320 },
    { month: 'Nov', revenue: 182000, profit: 69000, orders: 2550 },
    { month: 'Dec', revenue: 195000, profit: 75000, orders: 2710 }
  ];

  const sales = {
    cash: { amount: 45230, change: '+9%' },
    credit: { amount: 18715, change: '+27%' }
  };

  const debts = [
    { id: 'R-101', name: 'Abdulls Trading', amount: 1200, due: '2025-10-04', daysLeft: 2 },
    { id: 'R-202', name: 'Marta Grocers', amount: 340, due: '2025-10-07', daysLeft: 5 },
    { id: 'R-198', name: 'Eastside Retail', amount: 0, due: null, daysLeft: null },
  ];

  const inventoryAlerts = [
    { id: 'P-001', name: 'Granulated Sugar 50kg', stock: 8, threshold: 20, expiry: '2025-10-10' },
    { id: 'P-032', name: 'Cooking Oil 5L', stock: 50, threshold: 30, expiry: '2026-04-01' },
    { id: 'P-078', name: 'Basmati Rice 25kg', stock: 0, threshold: 10, expiry: '2025-09-29' },
  ];

  const pendingOrders = [
    { id: '#ORD-9921', customer: 'Abdiaziz Supplies', items: 12, total: 540, placed: '5m ago', status: 'Awaiting Approval' },
    { id: '#ORD-9932', customer: 'Moses Retail', items: 4, total: 85, placed: '22m ago', status: 'Packing' },
    { id: '#ORD-9939', customer: 'K-Wholesale', items: 20, total: 1290, placed: '1h ago', status: 'Pending Dispatch' },
  ];

  const recentActivities = [
    { id: 1, text: 'Order #ORD-9921 placed by Abdiaziz – 5m ago', type: 'order' },
    { id: 2, text: 'Payment received from Marta Grocers – 30m ago', type: 'payment' },
    { id: 3, text: 'Stock alert: Granulated Sugar 50kg low – 1h ago', type: 'alert' },
    { id: 4, text: 'New customer created: Abdiaziz Supplies – 2h ago', type: 'user' }
  ];

  const aiInsight = {
    title: 'AI Demand Pulse',
    message: 'Sugar demand projected to rise by 22% next week in coastal retail zones. Recommend increasing inbound by 15% and prioritizing sugar replenishment.',
    confidence: 'High',
    hologram: true
  };

  const computeAlertLevel = (item) => {
    const now = new Date();
    const expiry = item.expiry ? new Date(item.expiry) : null;
    const daysToExpiry = expiry ? Math.ceil((expiry - now) / (1000 * 60 * 60 * 24)) : null;

    if (item.stock === 0) return 'critical';
    if ((item.stock / item.threshold) < 0.25) return 'critical';
    if (daysToExpiry !== null && daysToExpiry <= 7) return 'warning';
    return 'healthy';
  };

  // Custom Tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          <p className="text-sm text-blue-600">
            Revenue: {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-green-600">
            Profit: {formatCurrency(payload[1].value)}
          </p>
          <p className="text-sm text-gray-600">
            Orders: {payload[2].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 p-6 font">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Wholesale Dashboard — Admin View</h1>
          <p className="mt-1 text-sm text-gray-500">High-level overview: sales, debts, inventory risks and actionable insights.</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-sm text-gray-700 hover:bg-gray-50">
            <FiActivity className="w-4 h-4 mr-2 text-gray-500" /> Activity
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:shadow-lg text-sm">
            Quick Reports
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} Icon={s.Icon} title={s.title} value={s.value} hint={s.hint} colorClass={s.colorClass} />
        ))}
      </div>

      {/* Monthly Performance Chart */}
      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Monthly Performance</h2>
            <p className="text-sm text-gray-500 mt-1">Revenue, profit, and order trends across the year</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Months</option>
              {monthlySalesData.map(month => (
                <option key={month.month} value={month.month}>{month.month}</option>
              ))}
            </select>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-gray-600">Revenue</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className="text-gray-600">Profit</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded"></div>
                <span className="text-gray-600">Orders</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlySalesData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="month" 
                stroke="#6b7280" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#6b7280" 
                fontSize={12}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="profit" fill="#10b981" radius={[2, 2, 0, 0]} />
              <Bar dataKey="orders" fill="#9ca3af" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales & AI Insight Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Sales */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Today's Sales</h2>
              <p className="text-sm text-gray-500 mt-1">Split between cash and credit — monitor trends for cashflow planning.</p>
            </div>
            <div className="text-sm text-gray-400">Updated just now</div>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-green-50 border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-green-600">Cash Sales</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(sales.cash.amount)}</p>
                </div>
                <div className="text-sm text-green-600 font-medium">{sales.cash.change}</div>
              </div>
              <div className="mt-3 text-xs text-gray-500">Tip: keep 15% of cash as float for day-to-day operations.</div>
            </div>

            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-yellow-700">Credit Sales</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(sales.credit.amount)}</p>
                </div>
                <div className="text-sm text-yellow-700 font-medium">{sales.credit.change}</div>
              </div>
              <div className="mt-3 text-xs text-gray-500">Monitor days payable to avoid overdue receivables affecting operations.</div>
            </div>
          </div>

          {/* Outstanding Debts */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800">Outstanding Debts</h3>
            <div className="mt-3 divide-y divide-gray-100 border-t border-gray-50">
              {debts.map((d) => {
                const overdue = d.daysLeft !== null && d.daysLeft <= 0;
                const badgeClass = overdue ? 'text-red-700 bg-red-50' : (d.daysLeft && d.daysLeft <= 7 ? 'text-orange-700 bg-orange-50' : 'text-green-700 bg-green-50');
                return (
                  <div key={d.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{d.name} <span className="text-xs text-gray-400">· {d.id}</span></p>
                      <p className="text-xs text-gray-500 mt-1">Due: {d.due || '—'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(d.amount)}</p>
                      <div className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${badgeClass}`}>
                        {overdue ? 'Overdue' : (d.daysLeft ? `${d.daysLeft}d left` : 'No balance')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">AI Demand Pulse</h3>
            <div className="p-2 bg-blue-50 rounded-md">
              <FiTrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">{aiInsight.message}</p>
                <div className="flex items-center mt-3 space-x-4">
                  <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <FiCheckCircle className="w-3 h-3 mr-1" />
                    {aiInsight.confidence} confidence
                  </span>
                  <span className="text-xs text-gray-500">Seasonal spike detected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-3">
            <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Action Plan
            </button>
            <button className="flex-1 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              Explore Forecast
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500 flex items-center">
            <FiClock className="w-3 h-3 mr-2" />
            Next update: 6 hours
          </div>
        </div>
      </div>

      {/* Inventory Alerts & Pending Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Inventory Alerts</h3>
            <div className="text-sm text-gray-400">Prioritize restock</div>
          </div>
          <div className="mt-4 space-y-3">
            {inventoryAlerts.map((item) => {
              const level = computeAlertLevel(item);
              const badge = level === 'critical' ? 'Critical' : level === 'warning' ? 'Expiry' : 'Healthy';
              return (
                <div key={item.id} className="flex items-center justify-between bg-gray-50 rounded-md p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">Stock: <span className="font-semibold">{item.stock}</span> • Threshold: {item.threshold}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge(level === 'critical' ? 'critical' : level === 'warning' ? 'warning' : 'healthy')}`}>
                      {level === 'critical' ? <FiAlertTriangle className="w-4 h-4 mr-1" /> : null}
                      {badge}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{item.expiry ? `Expiry: ${item.expiry}` : 'No expiry'}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Tip: Filter critical items and create a prioritized purchase order in one click.
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Pending Orders</h3>
            <div className="text-sm text-gray-400">Action required</div>
          </div>

          <div className="mt-4 divide-y divide-gray-100">
            {pendingOrders.map((o) => (
              <div key={o.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{o.customer} <span className="text-xs text-gray-400">· {o.id}</span></p>
                  <p className="text-xs text-gray-500 mt-1">{o.items} items • {o.placed}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(o.total)}</p>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-yellow-50 text-yellow-700">{o.status}</span>
                    <button className="ml-3 inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg shadow-sm hover:bg-indigo-700">Review</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <div className="text-sm text-gray-400">Activity feed</div>
          </div>

          <div className="mt-4 space-y-3">
            {recentActivities.map((a) => (
              <div key={a.id} className="flex items-start space-x-3">
                <div className="p-2 rounded-md bg-gray-50 text-gray-600">
                  <FiActivity className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{a.text}</p>
                  <p className="text-xs text-gray-400 mt-1">Auto-updated</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100">
              <FiPackage className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-700">Manage Products</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-lg hover:bg-green-100">
              <FiShoppingCart className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-700">Orders</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100">
              <FiCreditCard className="w-6 h-6 text-yellow-700 mb-2" />
              <span className="text-sm font-medium text-yellow-700">Payments</span>
            </button>
            <button className="flex flex-col items-center justify-center p-3 bg-indigo-50 rounded-lg hover:bg-indigo-100">
              <FiUsers className="w-6 h-6 text-indigo-600 mb-2" />
              <span className="text-sm font-medium text-indigo-700">Customers</span>
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Shortcuts: Create PO • Bulk price update • Export ledger.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;