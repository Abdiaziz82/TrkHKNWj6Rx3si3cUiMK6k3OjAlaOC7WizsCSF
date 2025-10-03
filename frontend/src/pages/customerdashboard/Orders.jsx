import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  MoreVertical,
  Truck,
  CheckCircle,
  Clock,
  Package,
  XCircle,
  AlertCircle,
  ChevronDown
} from "lucide-react";

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    retailerName: "John Doe",
    businessName: "Doe Supermarket",
    orderDate: "2024-12-15",
    deliveryDate: "2024-12-18",
    totalAmount: 450000,
    items: 12,
    status: "Pending",
    priority: "Medium",
    paymentStatus: "Paid",
    location: "Dar es Salaam",
    itemsList: [
      { name: "Sugar 1kg", quantity: 5, price: 2500 },
      { name: "Rice 5kg", quantity: 3, price: 15000 },
      { name: "Cooking Oil 2L", quantity: 4, price: 8000 }
    ]
  },
  {
    id: "ORD-002",
    retailerName: "Sarah Smith",
    businessName: "Smith Retail Store",
    orderDate: "2024-12-14",
    deliveryDate: "2024-12-17",
    totalAmount: 320000,
    items: 8,
    status: "Approved",
    priority: "High",
    paymentStatus: "Paid",
    location: "Arusha",
    itemsList: [
      { name: "Flour 2kg", quantity: 6, price: 3000 },
      { name: "Tea Leaves 500g", quantity: 2, price: 4500 }
    ]
  },
  {
    id: "ORD-003",
    retailerName: "Mike Johnson",
    businessName: "Johnson Wholesale",
    orderDate: "2024-12-13",
    deliveryDate: "2024-12-16",
    totalAmount: 280000,
    items: 6,
    status: "Dispatched",
    priority: "Medium",
    paymentStatus: "Pending",
    location: "Mwanza",
    itemsList: [
      { name: "Bread", quantity: 10, price: 2500 },
      { name: "Milk 1L", quantity: 8, price: 2800 }
    ]
  },
  {
    id: "ORD-004",
    retailerName: "Emily Brown",
    businessName: "Brown Trading Co.",
    orderDate: "2024-12-12",
    deliveryDate: "2024-12-15",
    totalAmount: 380000,
    items: 10,
    status: "Completed",
    priority: "Low",
    paymentStatus: "Paid",
    location: "Dodoma",
    itemsList: [
      { name: "Soap Bar", quantity: 20, price: 1500 },
      { name: "Toothpaste", quantity: 15, price: 3200 }
    ]
  },
  {
    id: "ORD-005",
    retailerName: "David Wilson",
    businessName: "Wilson Retail Hub",
    orderDate: "2024-12-11",
    deliveryDate: "2024-12-14",
    totalAmount: 290000,
    items: 7,
    status: "Pending",
    priority: "High",
    paymentStatus: "Pending",
    location: "Mbeya",
    itemsList: [
      { name: "Bottled Water 500ml", quantity: 24, price: 600 },
      { name: "Biscuits", quantity: 12, price: 1800 }
    ]
  },
  {
    id: "ORD-006",
    retailerName: "Grace Mwamba",
    businessName: "Mwamba Stores",
    orderDate: "2024-12-10",
    deliveryDate: "2024-12-13",
    totalAmount: 520000,
    items: 15,
    status: "Approved",
    priority: "Medium",
    paymentStatus: "Paid",
    location: "Dar es Salaam",
    itemsList: [
      { name: "Cooking Gas 6kg", quantity: 3, price: 45000 },
      { name: "Charcoal", quantity: 5, price: 8000 }
    ]
  },
  {
    id: "ORD-007",
    retailerName: "Robert Kimambo",
    businessName: "Kimambo Supermarket",
    orderDate: "2024-12-09",
    deliveryDate: "2024-12-12",
    totalAmount: 210000,
    items: 5,
    status: "Dispatched",
    priority: "High",
    paymentStatus: "Paid",
    location: "Arusha",
    itemsList: [
      { name: "Eggs Tray", quantity: 8, price: 12000 },
      { name: "Butter 500g", quantity: 4, price: 4800 }
    ]
  },
  {
    id: "ORD-008",
    retailerName: "Sarah Johnson",
    businessName: "Johnson Mini Mart",
    orderDate: "2024-12-08",
    deliveryDate: "2024-12-11",
    totalAmount: 340000,
    items: 9,
    status: "Completed",
    priority: "Medium",
    paymentStatus: "Paid",
    location: "Mwanza",
    itemsList: [
      { name: "Tomato Sauce", quantity: 12, price: 2200 },
      { name: "Pasta 500g", quantity: 10, price: 2800 }
    ]
  }
];

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("list"); // "list" or "detail"
  const itemsPerPage = 6;

  // Filter orders based on search and filters
  const filteredOrders = useMemo(() => {
    return mockOrders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.retailerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.businessName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || order.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [searchTerm, statusFilter, priorityFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
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
      case "Pending":
        return { color: "bg-yellow-100 text-yellow-800", icon: Clock };
      case "Approved":
        return { color: "bg-blue-100 text-blue-800", icon: CheckCircle };
      case "Dispatched":
        return { color: "bg-purple-100 text-purple-800", icon: Truck };
      case "Completed":
        return { color: "bg-green-100 text-green-800", icon: Package };
      default:
        return { color: "bg-gray-100 text-gray-800", icon: AlertCircle };
    }
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    return status === "Paid" 
      ? "bg-green-100 text-green-800" 
      : "bg-orange-100 text-orange-800";
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setView("detail");
  };

  const updateOrderStatus = (orderId, newStatus) => {
    // In a real app, this would be an API call
    const order = mockOrders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      // Refresh the view
      setSelectedOrder({...order});
    }
  };

  if (view === "detail" && selectedOrder) {
    return (
      <OrderDetail 
        order={selectedOrder}
        onBack={() => setView("list")}
        onStatusUpdate={updateOrderStatus}
        formatCurrency={formatCurrency}
        getStatusInfo={getStatusInfo}
        getPriorityColor={getPriorityColor}
        getPaymentStatusColor={getPaymentStatusColor}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 font">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">Track order statuses and manage deliveries</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Create Order</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{mockOrders.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {mockOrders.filter(o => o.status === "Pending").length}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {mockOrders.filter(o => o.status === "Dispatched").length}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {mockOrders.filter(o => o.status === "Completed").length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders..."
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
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Completed">Completed</option>
              </select>

              {/* Priority Filter */}
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Filter className="w-4 h-4" />
                <span>More Filters</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retailer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedOrders.map((order) => {
                  const StatusIcon = getStatusInfo(order.status).icon;
                  return (
                    <tr 
                      key={order.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleViewDetails(order)}
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-semibold text-gray-900 text-sm">{order.id}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-left">
                          <div className="font-semibold text-gray-900 text-sm">{order.retailerName}</div>
                          <div className="text-xs text-gray-500">{order.businessName}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-left">
                          <div className="font-semibold text-gray-900 text-sm">{formatCurrency(order.totalAmount)}</div>
                          <div className="text-xs text-gray-500">{order.items} items</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="w-4 h-4" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(order.status).color}`}>
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                          {order.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(order);
                            }}
                            className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                          >
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
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {paginatedOrders.length} of {filteredOrders.length} orders
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
        </div>
      </div>
    </div>
  );
};

// Order Detail Component
const OrderDetail = ({ order, onBack, onStatusUpdate, formatCurrency, getStatusInfo, getPriorityColor, getPaymentStatusColor }) => {
  const StatusIcon = getStatusInfo(order.status).icon;

  const statusSteps = [
    { status: "Pending", label: "Order Placed", completed: true },
    { status: "Approved", label: "Approved", completed: ["Approved", "Dispatched", "Completed"].includes(order.status) },
    { status: "Dispatched", label: "Dispatched", completed: ["Dispatched", "Completed"].includes(order.status) },
    { status: "Completed", label: "Delivered", completed: order.status === "Completed" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
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
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 text-sm">Order #{order.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
              <div className="space-y-4">
                {statusSteps.map((step, index) => (
                  <div key={step.status} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        step.completed ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </div>
                      {step.status === order.status && !step.completed && (
                        <div className="text-sm text-gray-500">Current Status</div>
                      )}
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div className={`w-px h-8 ml-3 ${
                        step.completed ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Status Update Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Update Status</h4>
                <div className="flex flex-wrap gap-2">
                  {statusSteps.map(step => (
                    <button
                      key={step.status}
                      onClick={() => onStatusUpdate(order.id, step.status)}
                      disabled={step.status === order.status}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        step.status === order.status
                          ? 'bg-blue-600 text-white cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Mark as {step.status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.itemsList.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">Quantity: {item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 text-sm">{formatCurrency(item.price * item.quantity)}</div>
                      <div className="text-xs text-gray-500">{formatCurrency(item.price)} each</div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="font-bold text-gray-900">Total</div>
                  <div className="font-bold text-gray-900 text-lg">{formatCurrency(order.totalAmount)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Retailer:</span>
                  <span className="font-medium">{order.retailerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Business:</span>
                  <span className="font-medium">{order.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{order.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Date:</span>
                  <span className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Status & Priority */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status:</span>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className="w-4 h-4" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusInfo(order.status).color}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(order.priority)}`}>
                    {order.priority}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 p-2 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors text-sm">
                  <Edit className="w-4 h-4 text-blue-600" />
                  <span>Edit Order</span>
                </button>
                <button className="w-full flex items-center space-x-2 p-2 text-left border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors text-sm">
                  <Truck className="w-4 h-4 text-green-600" />
                  <span>Track Delivery</span>
                </button>
                <button className="w-full flex items-center space-x-2 p-2 text-left border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors text-sm">
                  <Download className="w-4 h-4 text-purple-600" />
                  <span>Download Invoice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;