import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  CreditCard,
  Wallet,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Send,
  Calendar,
  DollarSign,
  Banknote,
  Receipt
} from "lucide-react";

// Mock payments data
const mockPayments = [
  {
    id: "PAY-001",
    orderId: "ORD-001",
    retailerName: "John Doe",
    businessName: "Doe Supermarket",
    paymentDate: "2024-12-15",
    dueDate: "2024-12-20",
    amount: 450000,
    status: "Paid",
    paymentMethod: "Bank Transfer",
    transactionId: "TXN-789012",
    invoiceNumber: "INV-2024-001",
    balance: 0,
    creditUsed: 0,
    paymentType: "Order Payment"
  },
  {
    id: "PAY-002",
    orderId: "ORD-002",
    retailerName: "Sarah Smith",
    businessName: "Smith Retail Store",
    paymentDate: "2024-12-14",
    dueDate: "2024-12-19",
    amount: 320000,
    status: "Pending",
    paymentMethod: "Credit Account",
    transactionId: "TXN-789013",
    invoiceNumber: "INV-2024-002",
    balance: 320000,
    creditUsed: 320000,
    paymentType: "Credit Purchase"
  },
  {
    id: "PAY-003",
    orderId: "ORD-003",
    retailerName: "Mike Johnson",
    businessName: "Johnson Wholesale",
    paymentDate: "2024-12-13",
    dueDate: "2024-12-18",
    amount: 280000,
    status: "Overdue",
    paymentMethod: "Cash",
    transactionId: "TXN-789014",
    invoiceNumber: "INV-2024-003",
    balance: 280000,
    creditUsed: 0,
    paymentType: "Order Payment"
  },
  {
    id: "PAY-004",
    orderId: "ORD-004",
    retailerName: "Emily Brown",
    businessName: "Brown Trading Co.",
    paymentDate: "2024-12-12",
    dueDate: "2024-12-17",
    amount: 380000,
    status: "Paid",
    paymentMethod: "Mobile Money",
    transactionId: "TXN-789015",
    invoiceNumber: "INV-2024-004",
    balance: 0,
    creditUsed: 0,
    paymentType: "Order Payment"
  },
  {
    id: "PAY-005",
    orderId: "ORD-005",
    retailerName: "David Wilson",
    businessName: "Wilson Retail Hub",
    paymentDate: "2024-12-11",
    dueDate: "2024-12-16",
    amount: 290000,
    status: "Pending",
    paymentMethod: "Credit Account",
    transactionId: "TXN-789016",
    invoiceNumber: "INV-2024-005",
    balance: 290000,
    creditUsed: 290000,
    paymentType: "Credit Purchase"
  },
  {
    id: "PAY-006",
    orderId: "ORD-006",
    retailerName: "Grace Mwamba",
    businessName: "Mwamba Stores",
    paymentDate: "2024-12-10",
    dueDate: "2024-12-15",
    amount: 520000,
    status: "Paid",
    paymentMethod: "Bank Transfer",
    transactionId: "TXN-789017",
    invoiceNumber: "INV-2024-006",
    balance: 0,
    creditUsed: 0,
    paymentType: "Order Payment"
  },
  {
    id: "PAY-007",
    orderId: "ORD-007",
    retailerName: "Robert Kimambo",
    businessName: "Kimambo Supermarket",
    paymentDate: "2024-12-09",
    dueDate: "2024-12-14",
    amount: 210000,
    status: "Failed",
    paymentMethod: "Mobile Money",
    transactionId: "TXN-789018",
    invoiceNumber: "INV-2024-007",
    balance: 210000,
    creditUsed: 0,
    paymentType: "Order Payment"
  },
  {
    id: "PAY-008",
    orderId: "ORD-008",
    retailerName: "Sarah Johnson",
    businessName: "Johnson Mini Mart",
    paymentDate: "2024-12-08",
    dueDate: "2024-12-13",
    amount: 340000,
    status: "Paid",
    paymentMethod: "Cash",
    transactionId: "TXN-789019",
    invoiceNumber: "INV-2024-008",
    balance: 0,
    creditUsed: 0,
    paymentType: "Order Payment"
  }
];

// Mock outstanding balances
const mockOutstandingBalances = [
  {
    retailerId: 2,
    retailerName: "Sarah Smith",
    businessName: "Smith Retail Store",
    totalBalance: 750000,
    overdueAmount: 320000,
    creditLimit: 3000000,
    creditUsed: 2800000,
    lastPaymentDate: "2024-11-30",
    lastPaymentAmount: 150000,
    paymentDueDate: "2024-12-25"
  },
  {
    retailerId: 3,
    retailerName: "Mike Johnson",
    businessName: "Johnson Wholesale",
    totalBalance: 450000,
    overdueAmount: 280000,
    creditLimit: 7000000,
    creditUsed: 0,
    lastPaymentDate: "2024-11-28",
    lastPaymentAmount: 200000,
    paymentDueDate: "2024-12-20"
  },
  {
    retailerId: 5,
    retailerName: "David Wilson",
    businessName: "Wilson Retail Hub",
    totalBalance: 620000,
    overdueAmount: 290000,
    creditLimit: 6000000,
    creditUsed: 3200000,
    lastPaymentDate: "2024-11-25",
    lastPaymentAmount: 180000,
    paymentDueDate: "2024-12-22"
  },
  {
    retailerId: 7,
    retailerName: "Robert Kimambo",
    businessName: "Kimambo Supermarket",
    totalBalance: 210000,
    overdueAmount: 210000,
    creditLimit: 2000000,
    creditUsed: 800000,
    lastPaymentDate: "2024-11-20",
    lastPaymentAmount: 120000,
    paymentDueDate: "2024-12-18"
  }
];

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("payments"); // "payments" or "outstanding"
  const itemsPerPage = 8;

  // Filter payments based on search and filters
  const filteredPayments = useMemo(() => {
    return mockPayments.filter(payment => {
      const matchesSearch = 
        payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.retailerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
      const matchesMethod = paymentMethodFilter === "all" || payment.paymentMethod === paymentMethodFilter;
      
      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [searchTerm, statusFilter, paymentMethodFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case "Paid":
        return { color: "bg-green-100 text-green-800", icon: CheckCircle };
      case "Pending":
        return { color: "bg-yellow-100 text-yellow-800", icon: Clock };
      case "Overdue":
        return { color: "bg-red-100 text-red-800", icon: AlertCircle };
      case "Failed":
        return { color: "bg-gray-100 text-gray-800", icon: XCircle };
      default:
        return { color: "bg-gray-100 text-gray-800", icon: Clock };
    }
  };

  // Get payment method color
  const getPaymentMethodColor = (method) => {
    switch (method) {
      case "Bank Transfer":
        return "bg-blue-100 text-blue-800";
      case "Mobile Money":
        return "bg-purple-100 text-purple-800";
      case "Credit Account":
        return "bg-orange-100 text-orange-800";
      case "Cash":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
  };

  const totalOutstanding = mockOutstandingBalances.reduce((sum, balance) => sum + balance.totalBalance, 0);
  const totalOverdue = mockOutstandingBalances.reduce((sum, balance) => sum + balance.overdueAmount, 0);

  if (selectedPayment) {
    return (
      <PaymentDetail 
        payment={selectedPayment}
        onBack={() => setSelectedPayment(null)}
        formatCurrency={formatCurrency}
        getStatusInfo={getStatusInfo}
        getPaymentMethodColor={getPaymentMethodColor}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">View payment history, receipts, and outstanding balances</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Receipt className="w-5 h-5" />
              <span>Create Invoice</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCurrency(mockPayments.filter(p => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0))}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding Balance</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCurrency(totalOutstanding)}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Payments</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCurrency(totalOverdue)}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <Clock className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful Payments</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {mockPayments.filter(p => p.status === "Paid").length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("payments")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "payments"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Payment History
              </button>
              <button
                onClick={() => setActiveTab("outstanding")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "outstanding"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Outstanding Balances
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "payments" ? (
              <>
                {/* Filters and Search */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                    {/* Search */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search payments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 text-sm"
                      />
                    </div>

                    {/* Status Filter */}
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                      <option value="Failed">Failed</option>
                    </select>

                    {/* Payment Method Filter */}
                    <select
                      value={paymentMethodFilter}
                      onChange={(e) => setPaymentMethodFilter(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="all">All Methods</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Mobile Money">Mobile Money</option>
                      <option value="Credit Account">Credit Account</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      <Filter className="w-4 h-4" />
                      <span>More Filters</span>
                    </button>
                  </div>
                </div>

                {/* Payments Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retailer</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedPayments.map((payment) => {
                        const StatusIcon = getStatusInfo(payment.status).icon;
                        return (
                          <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="font-semibold text-gray-900 text-sm">{payment.id}</div>
                              <div className="text-xs text-gray-500">{payment.orderId}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-left">
                                <div className="font-semibold text-gray-900 text-sm">{payment.retailerName}</div>
                                <div className="text-xs text-gray-500">{payment.businessName}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {payment.invoiceNumber}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="font-semibold text-gray-900 text-sm">{formatCurrency(payment.amount)}</div>
                              {payment.balance > 0 && (
                                <div className="text-xs text-red-600">Balance: {formatCurrency(payment.balance)}</div>
                              )}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <StatusIcon className="w-4 h-4" />
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(payment.status).color}`}>
                                  {payment.status}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(payment.paymentMethod)}`}>
                                {payment.paymentMethod}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {new Date(payment.paymentDate).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleViewDetails(payment)}
                                  className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                                  <Download className="w-4 h-4" />
                                </button>
                                <button className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-700">
                    Showing {paginatedPayments.length} of {filteredPayments.length} payments
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Outstanding Balances Tab */
              <div className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {mockOutstandingBalances.map((balance) => (
                    <div key={balance.retailerId} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{balance.retailerName}</h4>
                          <p className="text-sm text-gray-600">{balance.businessName}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          balance.overdueAmount > 0 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {balance.overdueAmount > 0 ? 'Overdue' : 'Pending'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Total Balance</p>
                          <p className="font-semibold text-gray-900">{formatCurrency(balance.totalBalance)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Overdue</p>
                          <p className="font-semibold text-red-600">{formatCurrency(balance.overdueAmount)}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                        <span>Credit Limit: {formatCurrency(balance.creditLimit)}</span>
                        <span>Used: {formatCurrency(balance.creditUsed)}</span>
                      </div>

                      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                        <span>Due: {new Date(balance.paymentDueDate).toLocaleDateString()}</span>
                        <span>Last Payment: {formatCurrency(balance.lastPaymentAmount)}</span>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                          Send Reminder
                        </button>
                        <button className="flex-1 border border-gray-300 py-2 px-3 rounded text-sm hover:bg-gray-50 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Detail Component
const PaymentDetail = ({ payment, onBack, formatCurrency, getStatusInfo, getPaymentMethodColor }) => {
  const StatusIcon = getStatusInfo(payment.status).icon;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button and Header */}
        <div className="flex items-center space-x-3 mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Details</h1>
            <p className="text-gray-600 text-sm">Payment #{payment.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Payment Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900">Amount</div>
                    <div className="text-sm text-gray-600">Total payment amount</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(payment.amount)}</div>
                    {payment.balance > 0 && (
                      <div className="text-sm text-red-600">Balance: {formatCurrency(payment.balance)}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment ID:</span>
                      <span className="font-medium">{payment.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">{payment.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Invoice Number:</span>
                      <span className="font-medium">{payment.invoiceNumber}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium">{payment.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Type:</span>
                      <span className="font-medium">{payment.paymentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Due Date:</span>
                      <span className="font-medium">{new Date(payment.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Retailer Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Retailer Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Retailer Name:</span>
                  <span className="font-medium">{payment.retailerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Business Name:</span>
                  <span className="font-medium">{payment.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Date:</span>
                  <span className="font-medium">{new Date(payment.paymentDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-6">
            {/* Payment Status */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className="w-4 h-4" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(payment.status).color}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(payment.paymentMethod)}`}>
                    {payment.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 p-2 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors text-sm">
                  <Download className="w-4 h-4 text-blue-600" />
                  <span>Download Receipt</span>
                </button>
                <button className="w-full flex items-center space-x-2 p-2 text-left border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors text-sm">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span>View Invoice</span>
                </button>
                <button className="w-full flex items-center space-x-2 p-2 text-left border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors text-sm">
                  <Send className="w-4 h-4 text-purple-600" />
                  <span>Send Reminder</span>
                </button>
              </div>
            </div>

            {/* Payment Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Order Created</span>
                  <span className="font-medium">{new Date(payment.paymentDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment Initiated</span>
                  <span className="font-medium">{new Date(payment.paymentDate).toLocaleDateString()}</span>
                </div>
                {payment.status === "Paid" && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Completed</span>
                    <span className="font-medium">{new Date(payment.paymentDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;