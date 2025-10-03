import React, { useState, useMemo } from "react";
import { 
  Download, 
  Filter, 
  Plus,
  DollarSign,
  CreditCard,
  Smartphone,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import LedgerTable from "./LedgerTable";
import PaymentCharts from "./PaymentCharts";

// Mock data for ledger entries
const ledgerData = [
  {
    id: 1,
    retailer: "John Doe",
    business: "Doe Supermarket",
    type: "credit_sale",
    amount: 2500000,
    dueDate: "2024-12-25",
    status: "overdue",
    paymentMethod: "credit",
    transactionDate: "2024-11-15",
    paidAmount: 0,
    remainingAmount: 2500000,
    phone: "+255 123 456 789",
    location: "Dar es Salaam"
  },
  {
    id: 2,
    retailer: "Sarah Smith",
    business: "Smith Retail Store",
    type: "cash_sale",
    amount: 1200000,
    dueDate: "2024-12-20",
    status: "paid",
    paymentMethod: "cash",
    transactionDate: "2024-12-15",
    paidAmount: 1200000,
    remainingAmount: 0,
    phone: "+255 987 654 321",
    location: "Arusha"
  },
  {
    id: 3,
    retailer: "Mike Johnson",
    business: "Johnson Wholesale",
    type: "credit_sale",
    amount: 1800000,
    dueDate: "2024-12-30",
    status: "pending",
    paymentMethod: "credit",
    transactionDate: "2024-12-10",
    paidAmount: 900000,
    remainingAmount: 900000,
    phone: "+255 456 789 123",
    location: "Mwanza"
  },
  {
    id: 4,
    retailer: "Emily Brown",
    business: "Brown Trading Co.",
    type: "mobile_money",
    amount: 850000,
    dueDate: "2024-12-18",
    status: "paid",
    paymentMethod: "mobile_money",
    transactionDate: "2024-12-16",
    paidAmount: 850000,
    remainingAmount: 0,
    phone: "+255 321 654 987",
    location: "Dodoma"
  },
  {
    id: 5,
    retailer: "David Wilson",
    business: "Wilson Retail Hub",
    type: "credit_sale",
    amount: 3200000,
    dueDate: "2025-01-05",
    status: "pending",
    paymentMethod: "credit",
    transactionDate: "2024-12-12",
    paidAmount: 1600000,
    remainingAmount: 1600000,
    phone: "+255 789 123 456",
    location: "Mbeya"
  },
  {
    id: 6,
    retailer: "Grace Mwita",
    business: "Mwita Mini Market",
    type: "mobile_money",
    amount: 450000,
    dueDate: "2024-12-22",
    status: "paid",
    paymentMethod: "mobile_money",
    transactionDate: "2024-12-17",
    paidAmount: 450000,
    remainingAmount: 0,
    phone: "+255 654 321 987",
    location: "Tanga"
  }
];

// Mock cash flow data
const cashFlowData = [
  { date: '2024-12-01', inflows: 4500000, outflows: 3200000, net: 1300000 },
  { date: '2024-12-02', inflows: 3800000, outflows: 2800000, net: 1000000 },
  { date: '2024-12-03', inflows: 5200000, outflows: 3500000, net: 1700000 },
  { date: '2024-12-04', inflows: 4100000, outflows: 3100000, net: 1000000 },
  { date: '2024-12-05', inflows: 4800000, outflows: 2900000, net: 1900000 },
  { date: '2024-12-06', inflows: 5500000, outflows: 3300000, net: 2200000 },
  { date: '2024-12-07', inflows: 3900000, outflows: 2700000, net: 1200000 },
];

function LedgerPayments() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("7d");

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
    const totalCredit = ledgerData
      .filter(item => item.paymentMethod === 'credit')
      .reduce((sum, item) => sum + item.remainingAmount, 0);

    const totalPaid = ledgerData.reduce((sum, item) => sum + item.paidAmount, 0);
    const totalPending = ledgerData
      .filter(item => item.status === 'pending')
      .reduce((sum, item) => sum + item.remainingAmount, 0);

    const overdueAmount = ledgerData
      .filter(item => item.status === 'overdue')
      .reduce((sum, item) => sum + item.remainingAmount, 0);

    const cashTransactions = ledgerData.filter(item => item.paymentMethod === 'cash').length;
    const mobileMoneyTransactions = ledgerData.filter(item => item.paymentMethod === 'mobile_money').length;

    return {
      totalCredit,
      totalPaid,
      totalPending,
      overdueAmount,
      cashTransactions,
      mobileMoneyTransactions,
      totalTransactions: ledgerData.length
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
        item.location.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesPaymentMethod && matchesSearch;
    });
  }, [filterStatus, filterPaymentMethod, searchTerm]);

  // Filter cash flow data based on time range
  const filteredCashFlowData = useMemo(() => {
    switch (timeRange) {
      case '7d': return cashFlowData.slice(-7);
      case '30d': return cashFlowData;
      default: return cashFlowData.slice(-7);
    }
  }, [timeRange]);

  const handleExport = (format) => {
    console.log(`Exporting data as ${format}`);
    // Implement export functionality here
    alert(`Exporting ledger data as ${format.toUpperCase()}`);
  };

  const handleAddTransaction = () => {
    // Implement add transaction functionality
    console.log("Add new transaction");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ledger & Payments</h1>
            <p className="text-gray-600 mt-1">Track cash, mobile money, and credit sales</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleAddTransaction}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Transaction</span>
            </button>
            <select 
              onChange={(e) => handleExport(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Export Report</option>
              <option value="csv">Export as CSV</option>
              <option value="pdf">Export as PDF</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Credit</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCurrency(metrics.totalCredit)}
                </p>
                <div className="text-sm text-red-600 mt-1">Outstanding</div>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCurrency(metrics.totalPaid)}
                </p>
                <div className="text-sm text-green-600 mt-1">Received</div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCurrency(metrics.overdueAmount)}
                </p>
                <div className="text-sm text-yellow-600 mt-1">Requires attention</div>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Mobile Money</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{metrics.mobileMoneyTransactions}</p>
                <div className="text-sm text-purple-600 mt-1">Transactions</div>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Smartphone className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          {/* Cash Flow Chart */}
          <div className="lg:col-span-2">
            <PaymentCharts 
              cashFlowData={filteredCashFlowData}
              ledgerData={ledgerData}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              formatCurrency={formatCurrency}
            />
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Paid</span>
                </div>
                <span className="text-sm font-semibold text-green-900">
                  {ledgerData.filter(item => item.status === 'paid').length}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">Pending</span>
                </div>
                <span className="text-sm font-semibold text-yellow-900">
                  {ledgerData.filter(item => item.status === 'pending').length}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-900">Overdue</span>
                </div>
                <span className="text-sm font-semibold text-red-900">
                  {ledgerData.filter(item => item.status === 'overdue').length}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Cash Transactions</span>
                  <span className="text-sm font-semibold">{metrics.cashTransactions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mobile Money</span>
                  <span className="text-sm font-semibold">{metrics.mobileMoneyTransactions}</span>
                </div>
              </div>
            </div>
          </div>
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