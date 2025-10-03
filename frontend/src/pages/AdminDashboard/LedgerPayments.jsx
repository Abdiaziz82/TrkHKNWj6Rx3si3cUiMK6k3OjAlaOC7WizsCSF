import React, { useState, useMemo } from "react";
import { 
  Download, 
  Plus,
  DollarSign,
  CreditCard,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  Receipt,
  Package,
  TrendingUp,
  BarChart3
} from "lucide-react";
import LedgerTable from "./LedgerTable";
import PaymentCharts from "./PaymentCharts";

// Comprehensive mock data with orders, bills, payments, and profits
const ledgerData = [
  {
    id: 1,
    retailer: "John Doe",
    business: "Doe Supermarket",
    orderId: "ORD-001",
    orderDate: "2024-11-15",
    type: "credit_sale",
    amount: 2500000,
    dueDate: "2024-12-25",
    status: "overdue",
    paymentMethod: "credit",
    transactionDate: "2024-11-15",
    paidAmount: 0,
    remainingAmount: 2500000,
    phone: "+255 123 456 789",
    location: "Dar es Salaam",
    // Order details
    orderItems: [
      { product: "Sugar (50kg)", quantity: 10, unitPrice: 80000, total: 800000 },
      { product: "Rice (50kg)", quantity: 15, unitPrice: 90000, total: 1350000 },
      { product: "Cooking Oil (20L)", quantity: 5, unitPrice: 70000, total: 350000 }
    ],
    // Cost and profit calculations
    costDetails: {
      productCost: 1800000,
      deliveryCost: 50000,
      tax: 125000,
      otherCharges: 25000,
      totalCost: 2000000
    },
    profit: 500000,
    profitMargin: "20%",
    // Payment history
    paymentHistory: [],
    // Discrepancies
    discrepancies: [
      { type: "overdue", description: "Payment overdue by 30 days", amount: 2500000, date: "2024-12-25" }
    ],
    notes: "High priority - Contact customer immediately"
  },
  {
    id: 2,
    retailer: "Sarah Smith",
    business: "Smith Retail Store",
    orderId: "ORD-002",
    orderDate: "2024-12-10",
    type: "cash_sale",
    amount: 1200000,
    dueDate: "2024-12-20",
    status: "paid",
    paymentMethod: "cash",
    transactionDate: "2024-12-15",
    paidAmount: 1200000,
    remainingAmount: 0,
    phone: "+255 987 654 321",
    location: "Arusha",
    orderItems: [
      { product: "Flour (25kg)", quantity: 8, unitPrice: 45000, total: 360000 },
      { product: "Beans (50kg)", quantity: 6, unitPrice: 70000, total: 420000 },
      { product: "Tea Leaves (10kg)", quantity: 4, unitPrice: 105000, total: 420000 }
    ],
    costDetails: {
      productCost: 900000,
      deliveryCost: 0,
      tax: 60000,
      otherCharges: 15000,
      totalCost: 975000
    },
    profit: 225000,
    profitMargin: "18.75%",
    paymentHistory: [
      { date: "2024-12-15", amount: 1200000, method: "cash", reference: "CASH-001" }
    ],
    discrepancies: [],
    notes: "Paid in full with cash on delivery"
  },
  {
    id: 3,
    retailer: "Mike Johnson",
    business: "Johnson Wholesale",
    orderId: "ORD-003",
    orderDate: "2024-12-05",
    type: "credit_sale",
    amount: 3200000,
    dueDate: "2024-12-30",
    status: "partial",
    paymentMethod: "credit",
    transactionDate: "2024-12-05",
    paidAmount: 1500000,
    remainingAmount: 1700000,
    phone: "+255 456 789 123",
    location: "Mwanza",
    orderItems: [
      { product: "Maize Flour (50kg)", quantity: 20, unitPrice: 75000, total: 1500000 },
      { product: "Wheat Flour (50kg)", quantity: 12, unitPrice: 85000, total: 1020000 },
      { product: "Salt (25kg)", quantity: 8, unitPrice: 85000, total: 680000 }
    ],
    costDetails: {
      productCost: 2560000,
      deliveryCost: 80000,
      tax: 160000,
      otherCharges: 40000,
      totalCost: 2840000
    },
    profit: 360000,
    profitMargin: "11.25%",
    paymentHistory: [
      { date: "2024-12-05", amount: 800000, method: "mobile_money", reference: "MM-456789" },
      { date: "2024-12-12", amount: 700000, method: "cash", reference: "CASH-002" }
    ],
    discrepancies: [
      { type: "partial_payment", description: "Partial payment received", amount: 1700000, date: "2024-12-30" }
    ],
    notes: "Regular customer - Good payment history"
  },
  {
    id: 4,
    retailer: "Emily Brown",
    business: "Brown Trading Co.",
    orderId: "ORD-004",
    orderDate: "2024-12-12",
    type: "mobile_money",
    amount: 1850000,
    dueDate: "2024-12-22",
    status: "paid",
    paymentMethod: "mobile_money",
    transactionDate: "2024-12-12",
    paidAmount: 1850000,
    remainingAmount: 0,
    phone: "+255 321 654 987",
    location: "Dodoma",
    orderItems: [
      { product: "Cooking Oil (5L)", quantity: 25, unitPrice: 28000, total: 700000 },
      { product: "Sugar (5kg)", quantity: 30, unitPrice: 12000, total: 360000 },
      { product: "Rice (10kg)", quantity: 40, unitPrice: 15000, total: 600000 },
      { product: "Soap (Box)", quantity: 10, unitPrice: 19000, total: 190000 }
    ],
    costDetails: {
      productCost: 1480000,
      deliveryCost: 25000,
      tax: 92500,
      otherCharges: 20000,
      totalCost: 1620500
    },
    profit: 229500,
    profitMargin: "12.41%",
    paymentHistory: [
      { date: "2024-12-12", amount: 1850000, method: "mobile_money", reference: "MM-123456" }
    ],
    discrepancies: [],
    notes: "Instant mobile money payment"
  },
  {
    id: 5,
    retailer: "David Wilson",
    business: "Wilson Retail Hub",
    orderId: "ORD-005",
    orderDate: "2024-12-08",
    type: "credit_sale",
    amount: 2750000,
    dueDate: "2025-01-08",
    status: "pending",
    paymentMethod: "credit",
    transactionDate: "2024-12-08",
    paidAmount: 0,
    remainingAmount: 2750000,
    phone: "+255 789 123 456",
    location: "Mbeya",
    orderItems: [
      { product: "Beverages (Crates)", quantity: 15, unitPrice: 80000, total: 1200000 },
      { product: "Biscuits (Cartons)", quantity: 8, unitPrice: 65000, total: 520000 },
      { product: "Canned Food (Cases)", quantity: 12, unitPrice: 86000, total: 1030000 }
    ],
    costDetails: {
      productCost: 2200000,
      deliveryCost: 60000,
      tax: 137500,
      otherCharges: 35000,
      totalCost: 2432500
    },
    profit: 317500,
    profitMargin: "11.55%",
    paymentHistory: [],
    discrepancies: [
      { type: "pending", description: "Payment due in 15 days", amount: 2750000, date: "2025-01-08" }
    ],
    notes: "New customer - Credit limit approved"
  }
];

function LedgerPayments() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("30d");

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate comprehensive metrics
  const metrics = useMemo(() => {
    const totalRevenue = ledgerData.reduce((sum, item) => sum + item.amount, 0);
    const totalPaid = ledgerData.reduce((sum, item) => sum + item.paidAmount, 0);
    const totalOutstanding = ledgerData.reduce((sum, item) => sum + item.remainingAmount, 0);
    const totalCost = ledgerData.reduce((sum, item) => sum + item.costDetails.totalCost, 0);
    const totalProfit = ledgerData.reduce((sum, item) => sum + item.profit, 0);
    
    const overdueAmount = ledgerData
      .filter(item => item.status === 'overdue')
      .reduce((sum, item) => sum + item.remainingAmount, 0);

    const pendingAmount = ledgerData
      .filter(item => item.status === 'pending' || item.status === 'partial')
      .reduce((sum, item) => sum + item.remainingAmount, 0);

    const cashTransactions = ledgerData.filter(item => item.paymentMethod === 'cash').length;
    const mobileMoneyTransactions = ledgerData.filter(item => item.paymentMethod === 'mobile_money').length;
    const creditTransactions = ledgerData.filter(item => item.paymentMethod === 'credit').length;

    const averageProfitMargin = totalProfit / totalRevenue * 100;

    return {
      totalRevenue,
      totalPaid,
      totalOutstanding,
      totalCost,
      totalProfit,
      overdueAmount,
      pendingAmount,
      cashTransactions,
      mobileMoneyTransactions,
      creditTransactions,
      totalTransactions: ledgerData.length,
      averageProfitMargin: averageProfitMargin.toFixed(1)
    };
  }, []);

  // Filter ledger data
  const filteredLedgerData = useMemo(() => {
    return ledgerData.filter(item => {
      const matchesStatus = filterStatus === "all" || item.status === filterStatus;
      const matchesPaymentMethod = filterPaymentMethod === "all" || item.paymentMethod === filterPaymentMethod;
      const matchesSearch = 
        item.retailer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.orderId.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesPaymentMethod && matchesSearch;
    });
  }, [filterStatus, filterPaymentMethod, searchTerm]);

  // Enhanced export functionality
  const handleExport = (format) => {
    if (!format) return;
    
    const exportData = filteredLedgerData.map(item => ({
      'Order ID': item.orderId,
      'Retailer': item.retailer,
      'Business': item.business,
      'Location': item.location,
      'Order Date': item.orderDate,
      'Due Date': item.dueDate,
      'Total Amount': item.amount,
      'Paid Amount': item.paidAmount,
      'Remaining Amount': item.remainingAmount,
      'Status': item.status,
      'Payment Method': item.paymentMethod,
      'Product Cost': item.costDetails.productCost,
      'Delivery Cost': item.costDetails.deliveryCost,
      'Tax': item.costDetails.tax,
      'Other Charges': item.costDetails.otherCharges,
      'Total Cost': item.costDetails.totalCost,
      'Profit': item.profit,
      'Profit Margin': item.profitMargin,
      'Order Items': item.orderItems.map(order => 
        `${order.product} (Qty: ${order.quantity}) - ${formatCurrency(order.total)}`
      ).join('; '),
      'Payment History': item.paymentHistory.map(payment => 
        `${payment.date}: ${formatCurrency(payment.amount)} (${payment.method}) - Ref: ${payment.reference}`
      ).join('; '),
      'Discrepancies': item.discrepancies.map(d => 
        `${d.type}: ${d.description} - ${formatCurrency(d.amount)}`
      ).join('; '),
      'Notes': item.notes
    }));

    if (format === 'csv') {
      exportToCSV(exportData);
    } else if (format === 'pdf') {
      exportToPDF(exportData);
    } else if (format === 'excel') {
      exportToExcel(exportData);
    }
  };

  const exportToCSV = (data) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(value => 
        `"${String(value).replace(/"/g, '""')}"`
      ).join(',')
    ).join('\n');
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `ledger-profits-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('CSV file exported successfully!');
  };

  const exportToPDF = (data) => {
    alert('PDF export would be implemented with a library like jsPDF');
    console.log('PDF Data:', data);
  };

  const exportToExcel = (data) => {
    alert('Excel export would be implemented with a library like xlsx');
    console.log('Excel Data:', data);
  };

  const handleAddTransaction = () => {
    console.log("Add new transaction");
    // Implementation for adding new transaction
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profit & Payment Ledger</h1>
            <p className="text-gray-600 mt-1">Track orders, payments, profits, and discrepancies</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleAddTransaction}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Order</span>
            </button>
            <select 
              onChange={(e) => handleExport(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Export Report</option>
              <option value="csv">Export as CSV</option>
              <option value="excel">Export as Excel</option>
              <option value="pdf">Export as PDF</option>
            </select>
          </div>
        </div>

        {/* Profit & Revenue Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCurrency(metrics.totalRevenue)}
                </p>
                <div className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {metrics.totalTransactions} Orders
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Profit</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCurrency(metrics.totalProfit)}
                </p>
                <div className="text-sm text-blue-600 mt-1">
                  {metrics.averageProfitMargin}% Avg Margin
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCurrency(metrics.totalOutstanding)}
                </p>
                <div className="text-sm text-red-600 mt-1">
                  {formatCurrency(metrics.overdueAmount)} Overdue
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
                <p className="text-sm font-medium text-gray-600">Collected</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCurrency(metrics.totalPaid)}
                </p>
                <div className="text-sm text-purple-600 mt-1">
                  {metrics.cashTransactions + metrics.mobileMoneyTransactions} Paid Orders
                </div>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cash Payments</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.cashTransactions}</p>
                <div className="text-sm text-green-600 mt-1">Transactions</div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mobile Money</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.mobileMoneyTransactions}</p>
                <div className="text-sm text-blue-600 mt-1">Transactions</div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Smartphone className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Credit Sales</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.creditTransactions}</p>
                <div className="text-sm text-orange-600 mt-1">Pending</div>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-6">
          <PaymentCharts
            ledgerData={filteredLedgerData}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            formatCurrency={formatCurrency}
          />
        </div>

        {/* Ledger Table */}
        <LedgerTable
          data={filteredLedgerData}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterPaymentMethod={filterPaymentMethod}
          setFilterPaymentMethod={setFilterPaymentMethod}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
}

export default LedgerPayments;