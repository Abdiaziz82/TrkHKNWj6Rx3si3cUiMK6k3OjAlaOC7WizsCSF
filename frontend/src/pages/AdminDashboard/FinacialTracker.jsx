import React, { useState, useMemo } from "react";
import { 
  Download, 
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  ShoppingCart,
  Truck,
  Building,
  Users,
  CreditCard,
  Smartphone,
  Calendar,
  Filter,
  Search
} from "lucide-react";

// Comprehensive financial data
const financialData = [
  {
    id: 1,
    category: "Product Costs",
    type: "expense",
    amount: 12500000,
    percentage: 45,
    items: [
      { name: "Sugar Inventory", amount: 3500000, date: "2024-12-15", profitable: false },
      { name: "Rice Stock", amount: 2800000, date: "2024-12-10", profitable: true },
      { name: "Cooking Oil", amount: 2200000, date: "2024-12-08", profitable: true },
      { name: "Flour Supply", amount: 1800000, date: "2024-12-05", profitable: true },
      { name: "Beverages", amount: 1200000, date: "2024-12-12", profitable: false },
      { name: "Canned Food", amount: 1000000, date: "2024-12-18", profitable: false }
    ],
    trend: "increasing",
    efficiency: 65,
    description: "Raw material and inventory purchases"
  },
  {
    id: 2,
    category: "Operational Expenses",
    type: "expense",
    amount: 4800000,
    percentage: 17,
    items: [
      { name: "Warehouse Rent", amount: 1200000, date: "2024-12-01", profitable: false },
      { name: "Utilities", amount: 850000, date: "2024-12-05", profitable: false },
      { name: "Staff Salaries", amount: 2000000, date: "2024-12-25", profitable: true },
      { name: "Office Supplies", amount: 350000, date: "2024-12-15", profitable: false },
      { name: "Maintenance", amount: 400000, date: "2024-12-20", profitable: true }
    ],
    trend: "stable",
    efficiency: 40,
    description: "Day-to-day business operations"
  },
  {
    id: 3,
    category: "Delivery & Logistics",
    type: "expense",
    amount: 3200000,
    percentage: 12,
    items: [
      { name: "Fuel Costs", amount: 1500000, date: "2024-12-08", profitable: true },
      { name: "Vehicle Maintenance", amount: 800000, date: "2024-12-12", profitable: false },
      { name: "Driver Salaries", amount: 600000, date: "2024-12-25", profitable: true },
      { name: "Insurance", amount: 300000, date: "2024-12-01", profitable: true }
    ],
    trend: "increasing",
    efficiency: 75,
    description: "Transportation and distribution costs"
  },
  {
    id: 4,
    category: "Marketing & Sales",
    type: "expense",
    amount: 1800000,
    percentage: 6,
    items: [
      { name: "Digital Marketing", amount: 800000, date: "2024-12-10", profitable: true },
      { name: "Print Materials", amount: 300000, date: "2024-12-05", profitable: false },
      { name: "Sales Commissions", amount: 500000, date: "2024-12-20", profitable: true },
      { name: "Promotional Events", amount: 200000, date: "2024-12-15", profitable: false }
    ],
    trend: "decreasing",
    efficiency: 55,
    description: "Customer acquisition and retention"
  },
  {
    id: 5,
    category: "Revenue Streams",
    type: "income",
    amount: 28500000,
    percentage: 100,
    items: [
      { name: "Sugar Sales", amount: 6500000, date: "2024-12-18", profitable: true, margin: 25 },
      { name: "Rice Sales", amount: 7200000, date: "2024-12-12", profitable: true, margin: 30 },
      { name: "Cooking Oil Sales", amount: 5800000, date: "2024-12-08", profitable: true, margin: 28 },
      { name: "Flour Sales", amount: 4500000, date: "2024-12-05", profitable: true, margin: 22 },
      { name: "Beverage Sales", amount: 2800000, date: "2024-12-20", profitable: false, margin: -5 },
      { name: "Canned Food Sales", amount: 1700000, date: "2024-12-15", profitable: false, margin: -8 }
    ],
    trend: "increasing",
    efficiency: 82,
    description: "All revenue generating activities"
  },
  {
    id: 6,
    category: "Taxes & Compliance",
    type: "expense",
    amount: 2200000,
    percentage: 8,
    items: [
      { name: "Income Tax", amount: 1500000, date: "2024-12-30", profitable: false },
      { name: "Business License", amount: 400000, date: "2024-12-28", profitable: false },
      { name: "Other Fees", amount: 300000, date: "2024-12-25", profitable: false }
    ],
    trend: "stable",
    efficiency: 10,
    description: "Government and regulatory payments"
  },
  {
    id: 7,
    category: "Technology & Software",
    type: "expense",
    amount: 950000,
    percentage: 3,
    items: [
      { name: "Accounting Software", amount: 300000, date: "2024-12-01", profitable: true },
      { name: "POS System", amount: 400000, date: "2024-12-10", profitable: true },
      { name: "Website Maintenance", amount: 250000, date: "2024-12-15", profitable: false }
    ],
    trend: "increasing",
    efficiency: 70,
    description: "Digital tools and systems"
  }
];

function FinancialTracker() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [timeRange, setTimeRange] = useState("month");
  const [viewType, setViewType] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Calculate comprehensive financial metrics
  const financialMetrics = useMemo(() => {
    const totalIncome = financialData.find(d => d.type === 'income')?.amount || 0;
    const totalExpenses = financialData
      .filter(d => d.type === 'expense')
      .reduce((sum, item) => sum + item.amount, 0);
    
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = (netProfit / totalIncome) * 100;

    // Profitable vs Non-profitable analysis
    const profitableItems = financialData.flatMap(category => 
      category.items.filter(item => item.profitable)
    );
    const nonProfitableItems = financialData.flatMap(category => 
      category.items.filter(item => !item.profitable)
    );

    const totalProfitableAmount = profitableItems.reduce((sum, item) => sum + item.amount, 0);
    const totalNonProfitableAmount = nonProfitableItems.reduce((sum, item) => sum + item.amount, 0);

    // Efficiency analysis
    const efficientCategories = financialData.filter(cat => cat.efficiency >= 60);
    const inefficientCategories = financialData.filter(cat => cat.efficiency < 60);

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin: profitMargin.toFixed(1),
      profitableItems: profitableItems.length,
      nonProfitableItems: nonProfitableItems.length,
      totalProfitableAmount,
      totalNonProfitableAmount,
      efficientCategories: efficientCategories.length,
      inefficientCategories: inefficientCategories.length,
      moneyMovement: {
        productive: (totalProfitableAmount / totalExpenses * 100).toFixed(1),
        wasteful: (totalNonProfitableAmount / totalExpenses * 100).toFixed(1)
      }
    };
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Product Costs': return <ShoppingCart className="w-5 h-5" />;
      case 'Operational Expenses': return <Building className="w-5 h-5" />;
      case 'Delivery & Logistics': return <Truck className="w-5 h-5" />;
      case 'Marketing & Sales': return <Users className="w-5 h-5" />;
      case 'Revenue Streams': return <DollarSign className="w-5 h-5" />;
      case 'Taxes & Compliance': return <CreditCard className="w-5 h-5" />;
      case 'Technology & Software': return <BarChart3 className="w-5 h-5" />;
      default: return <DollarSign className="w-5 h-5" />;
    }
  };

  // Export functionality
  const handleExport = (format) => {
    if (!format) return;

    const exportData = financialData.map(category => ({
      'Category': category.category,
      'Type': category.type,
      'Amount': category.amount,
      'Percentage': category.percentage + '%',
      'Trend': category.trend,
      'Efficiency': category.efficiency + '%',
      'Description': category.description,
      'Items': category.items.map(item => 
        `${item.name}: ${formatCurrency(item.amount)} (${item.profitable ? 'Profitable' : 'Not Profitable'})`
      ).join('; ')
    }));

    if (format === 'csv') {
      exportToCSV(exportData);
    }
  };

  const exportToCSV = (data) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `financial-analysis-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Health Tracker</h1>
            <p className="text-gray-600 mt-1">Track where your money goes and identify profitable areas</p>
          </div>
          <div className="flex items-center space-x-3">
            <select 
              onChange={(e) => setViewType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="overview">Overview</option>
              <option value="detailed">Detailed Analysis</option>
              <option value="profitability">Profitability</option>
            </select>
            <select 
              onChange={(e) => handleExport(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Export Report</option>
              <option value="csv">Export as CSV</option>
            </select>
          </div>
        </div>

        {/* Key Financial Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Profit</p>
                <p className={`text-xl font-bold mt-1 ${
                  financialMetrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(financialMetrics.netProfit)}
                </p>
                <div className="text-sm text-gray-500 mt-1">
                  Margin: {financialMetrics.profitMargin}%
                </div>
              </div>
              <div className={`p-2 rounded-lg ${
                financialMetrics.netProfit >= 0 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {financialMetrics.netProfit >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Productive Money</p>
                <p className="text-xl font-bold text-green-600 mt-1">
                  {financialMetrics.moneyMovement.productive}%
                </p>
                <div className="text-sm text-gray-500 mt-1">
                  {formatCurrency(financialMetrics.totalProfitableAmount)}
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wasteful Spending</p>
                <p className="text-xl font-bold text-red-600 mt-1">
                  {financialMetrics.moneyMovement.wasteful}%
                </p>
                <div className="text-sm text-gray-500 mt-1">
                  {formatCurrency(financialMetrics.totalNonProfitableAmount)}
                </div>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Efficient Areas</p>
                <p className="text-xl font-bold text-blue-600 mt-1">
                  {financialMetrics.efficientCategories}/{financialData.length}
                </p>
                <div className="text-sm text-gray-500 mt-1">Categories</div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Income vs Expenses */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Money Flow Analysis</h3>
            <div className="space-y-4">
              {financialData.map((category) => (
                <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        category.type === 'income' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {getCategoryIcon(category.category)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{category.category}</h4>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        category.type === 'income' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {formatCurrency(category.amount)}
                      </p>
                      <p className="text-sm text-gray-500">{category.percentage}% of {category.type === 'income' ? 'revenue' : 'expenses'}</p>
                    </div>
                  </div>
                  
                  {/* Efficiency Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Efficiency</span>
                      <span>{category.efficiency}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          category.efficiency >= 70 ? 'bg-green-500' :
                          category.efficiency >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${category.efficiency}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Items Breakdown */}
                  <div className="space-y-2">
                    {category.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            item.profitable ? 'bg-green-500' : 'bg-red-500'
                          }`}></div>
                          <span className={item.profitable ? 'text-green-700' : 'text-red-700'}>
                            {item.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{formatCurrency(item.amount)}</span>
                          {item.margin && (
                            <span className={`text-xs ${
                              item.margin >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {item.margin}%
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {category.items.length > 3 && (
                      <button 
                        onClick={() => setSelectedCategory(selectedCategory?.id === category.id ? null : category)}
                        className="text-blue-600 text-sm hover:text-blue-700"
                      >
                        +{category.items.length - 3} more items
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar - Insights & Recommendations */}
          <div className="space-y-6">
            {/* Profitability Analysis */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profitability Heatmap</h3>
              <div className="space-y-3">
                {financialData
                  .filter(cat => cat.type === 'expense')
                  .map(category => {
                    const profitableCount = category.items.filter(item => item.profitable).length;
                    const totalCount = category.items.length;
                    const profitabilityRate = (profitableCount / totalCount) * 100;
                    
                    return (
                      <div key={category.id} className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{category.category}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                profitabilityRate >= 70 ? 'bg-green-500' :
                                profitabilityRate >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${profitabilityRate}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 w-8">{profitabilityRate.toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Top Wasteful Areas */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200">
              <h3 className="text-lg font-semibold text-red-900 mb-4">⚠️ Wasteful Areas</h3>
              <div className="space-y-3">
                {financialData
                  .flatMap(category => 
                    category.items
                      .filter(item => !item.profitable)
                      .map(item => ({ ...item, category: category.category }))
                  )
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-red-50 rounded">
                      <div>
                        <div className="text-sm font-medium text-red-900">{item.name}</div>
                        <div className="text-xs text-red-700">{item.category}</div>
                      </div>
                      <div className="text-red-900 font-semibold">{formatCurrency(item.amount)}</div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Top Profitable Areas */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4">💰 Top Performers</h3>
              <div className="space-y-3">
                {financialData
                  .flatMap(category => 
                    category.items
                      .filter(item => item.profitable)
                      .map(item => ({ ...item, category: category.category }))
                  )
                  .sort((a, b) => b.amount - a.amount)
                  .slice(0, 5)
                  .map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                      <div>
                        <div className="text-sm font-medium text-green-900">{item.name}</div>
                        <div className="text-xs text-green-700">{item.category}</div>
                      </div>
                      <div className="text-green-900 font-semibold">
                        {formatCurrency(item.amount)}
                        {item.margin && (
                          <span className="text-xs ml-1">({item.margin}%)</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Recommendations</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-start space-x-2">
                  <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Reduce spending on Beverages and Canned Food (negative margins)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <BarChart3 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Increase investment in Rice and Cooking Oil (30%+ margins)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Review operational expenses - 60% are non-productive</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Detail Modal */}
        {selectedCategory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedCategory.category}</h3>
                    <p className="text-gray-600">{selectedCategory.description}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-3">
                  {selectedCategory.items.map((item, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      item.profitable ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                    }`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.date}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${
                            item.profitable ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {formatCurrency(item.amount)}
                          </div>
                          <div className={`text-sm ${
                            item.profitable ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.profitable ? 'Profitable' : 'Not Profitable'}
                            {item.margin && ` • Margin: ${item.margin}%`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FinancialTracker;