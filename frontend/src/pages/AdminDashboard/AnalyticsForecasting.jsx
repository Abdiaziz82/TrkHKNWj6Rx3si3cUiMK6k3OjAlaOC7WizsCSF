import React, { useState, useMemo } from "react";
import { Download, Filter, Calendar } from "lucide-react";
import AnalyticsCharts from "./AnalyticsCharts";

// Mock data
const salesData = [
  { month: 'Jan', sales: 4500000, orders: 45, customers: 32 },
  { month: 'Feb', sales: 5200000, orders: 52, customers: 38 },
  { month: 'Mar', sales: 4800000, orders: 48, customers: 35 },
  { month: 'Apr', sales: 6100000, orders: 61, customers: 45 },
  { month: 'May', sales: 5800000, orders: 58, customers: 42 },
  { month: 'Jun', sales: 7200000, orders: 72, customers: 52 },
  { month: 'Jul', sales: 6800000, orders: 68, customers: 48 },
  { month: 'Aug', sales: 7500000, orders: 75, customers: 55 },
  { month: 'Sep', sales: 8200000, orders: 82, customers: 60 },
  { month: 'Oct', sales: 7900000, orders: 79, customers: 58 },
  { month: 'Nov', sales: 8800000, orders: 88, customers: 65 },
  { month: 'Dec', sales: 9500000, orders: 95, customers: 70 }
];

const productPerformance = [
  { product: 'Rice 50kg', sales: 2500000, growth: 15, stock: 120 },
  { product: 'Cooking Oil 20L', sales: 1800000, growth: 8, stock: 85 },
  { product: 'Sugar 25kg', sales: 1200000, growth: -2, stock: 45 },
  { product: 'Flour 25kg', sales: 950000, growth: 12, stock: 60 },
  { product: 'Beans 50kg', sales: 750000, growth: 25, stock: 30 }
];

const retailerPerformance = [
  { name: 'John Doe', location: 'Dar es Salaam', orders: 45, value: 12500000, growth: 12 },
  { name: 'Sarah Smith', location: 'Arusha', orders: 32, value: 8400000, growth: 8 },
  { name: 'Mike Johnson', location: 'Mwanza', orders: 67, value: 18700000, growth: 15 },
  { name: 'Emily Brown', location: 'Dodoma', orders: 28, value: 9600000, growth: -5 },
  { name: 'David Wilson', location: 'Mbeya', orders: 51, value: 14300000, growth: 20 }
];

const forecastData = [
  { month: 'Jan 2025', forecast: 9800000, confidence: 85 },
  { month: 'Feb 2025', forecast: 10500000, confidence: 82 },
  { month: 'Mar 2025', forecast: 11200000, confidence: 78 },
  { month: 'Apr 2025', forecast: 10800000, confidence: 80 },
  { month: 'May 2025', forecast: 11500000, confidence: 75 }
];

export default function AnalyticsForecasting() {
  const [timeRange, setTimeRange] = useState('6m');
  const [selectedMetric, setSelectedMetric] = useState('sales');

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    const currentData = salesData.slice(-6);
    const previousData = salesData.slice(-12, -6);
    
    const currentSales = currentData.reduce((sum, item) => sum + item.sales, 0);
    const previousSales = previousData.reduce((sum, item) => sum + item.sales, 0);
    const salesGrowth = ((currentSales - previousSales) / previousSales) * 100;

    const currentOrders = currentData.reduce((sum, item) => sum + item.orders, 0);
    const previousOrders = previousData.reduce((sum, item) => sum + item.orders, 0);
    const ordersGrowth = ((currentOrders - previousOrders) / previousOrders) * 100;

    const currentCustomers = currentData.reduce((sum, item) => sum + item.customers, 0);
    const previousCustomers = previousData.reduce((sum, item) => sum + item.customers, 0);
    const customersGrowth = ((currentCustomers - previousCustomers) / previousCustomers) * 100;

    const avgOrderValue = currentSales / currentOrders;

    return {
      totalSales: currentSales,
      salesGrowth,
      totalOrders: currentOrders,
      ordersGrowth,
      totalCustomers: currentCustomers,
      customersGrowth,
      avgOrderValue
    };
  }, []);

  // Filter data based on time range
  const filteredSalesData = useMemo(() => {
    switch (timeRange) {
      case '3m': return salesData.slice(-3);
      case '6m': return salesData.slice(-6);
      case '1y': return salesData;
      default: return salesData.slice(-6);
    }
  }, [timeRange]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 font">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Forecasting</h1>
            <p className="text-gray-600 mt-1">AI-powered insights and performance predictions</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Analytics Content */}
        <AnalyticsCharts
          metrics={metrics}
          filteredSalesData={filteredSalesData}
          forecastData={forecastData}
          productPerformance={productPerformance}
          retailerPerformance={retailerPerformance}
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          selectedMetric={selectedMetric}
          setSelectedMetric={setSelectedMetric}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}