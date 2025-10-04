import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  Package,
  AlertCircle,
  Receipt,
  MapPin,
  Calendar,
  CreditCard,
  Wallet
} from "lucide-react";

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("list");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 6;

  // Current user information
  const currentUser = {
    id: "CUST-001",
    name: "Abiaziz Mohammed",
    business: "Abiaziz Supermarket",
    location: "Dar es Salaam",
    phone: "+255 789 123 456",
    email: "abiaziz@business.com"
  };

  // Fetch orders from localStorage (where products page saves orders)
  useEffect(() => {
    const fetchOrders = () => {
      try {
        setIsLoading(true);
        const savedOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
        
        // Transform the data to match our order structure
        const transformedOrders = savedOrders.map((order, index) => {
          const orderDate = new Date(order.createdAt);
          const deliveryDate = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 days
          
          return {
            id: order.orderNumber || `ORD-${String(index + 1).padStart(3, '0')}`,
            customerId: currentUser.id,
            retailerName: currentUser.name,
            businessName: currentUser.business,
            orderDate: orderDate.toISOString().split('T')[0],
            deliveryDate: deliveryDate.toISOString().split('T')[0],
            totalAmount: order.total,
            items: order.items ? order.items.length : 0,
            status: order.status === 'paid' ? 'Approved' : 
                   order.status === 'pending' ? 'Pending' : 'Pending',
            priority: "Medium",
            paymentStatus: order.status === 'paid' ? 'Paid' : 
                         order.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Pending Payment',
            paymentMethod: order.paymentMethod,
            paymentDetails: order.phoneNumber ? {
              provider: order.paymentMethod,
              phoneNumber: order.phoneNumber,
              transactionId: order.paymentMethod === 'M-Pesa' ? `MPE${Date.now()}` : 
                           order.paymentMethod === 'Airtel Money' ? `AIR${Date.now()}` : 
                           `TIG${Date.now()}`,
              paidAt: new Date().toLocaleString()
            } : null,
            location: currentUser.location,
            itemsList: order.items ? order.items.map(item => ({
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              category: "Groceries"
            })) : [],
            tracking: {
              currentLocation: order.status === 'paid' ? "Warehouse Processing" : "Order Received",
              estimatedDelivery: deliveryDate.toISOString().split('T')[0],
              driver: order.status === 'paid' ? "John M. - +255 789 012 345" : "Not assigned yet",
              updates: [
                { 
                  status: "Order Placed", 
                  timestamp: orderDate.toLocaleString(), 
                  location: "Online" 
                },
                ...(order.status === 'paid' ? [{
                  status: "Processing",
                  timestamp: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000).toLocaleString(),
                  location: "Warehouse"
                }] : [])
              ]
            }
          };
        });

        // Sort orders by date (newest first)
        transformedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(transformedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();

    // Listen for storage changes (when new orders are added from products page)
    const handleStorageChange = () => {
      fetchOrders();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check periodically for new orders
    const interval = setInterval(fetchOrders, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // Only show orders for the current user
  const userOrders = useMemo(() => {
    return orders.filter(order => order.customerId === currentUser.id);
  }, [orders]);

  // Filter orders based on search and filters
  const filteredOrders = useMemo(() => {
    return userOrders.filter(order => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase());
     
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
     
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, userOrders]);

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
        return { color: "bg-yellow-100 text-yellow-800", icon: Clock, description: "Your order is being processed" };
      case "Approved":
        return { color: "bg-blue-100 text-blue-800", icon: CheckCircle, description: "Order approved and ready for dispatch" };
      case "Dispatched":
        return { color: "bg-purple-100 text-purple-800", icon: Truck, description: "Your order is on the way" };
      case "Completed":
        return { color: "bg-green-100 text-green-800", icon: Package, description: "Order delivered successfully" };
      case "Cancelled":
        return { color: "bg-red-100 text-red-800", icon: AlertCircle, description: "Order has been cancelled" };
      default:
        return { color: "bg-gray-100 text-gray-800", icon: AlertCircle, description: "Unknown status" };
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending Payment":
        return "bg-orange-100 text-orange-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setView("detail");
  };

  const handlePrintReceipt = (order) => {
    const receiptWindow = window.open('', '_blank');
    receiptWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${order.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            .item {
              display: flex;
              justify-content: space-between;
              margin: 8px 0;
              padding: 5px 0;
            }
            .total {
              border-top: 2px solid #000;
              margin-top: 15px;
              padding-top: 15px;
              font-weight: bold;
              font-size: 1.1em;
            }
            .section {
              margin: 15px 0;
            }
            .thank-you {
              text-align: center;
              margin-top: 20px;
              font-style: italic;
              color: #666;
            }
            .payment-info {
              background: #f5f5f5;
              padding: 10px;
              border-radius: 5px;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ORDER RECEIPT</h1>
            <h2>${order.businessName}</h2>
            <p><strong>Receipt ID:</strong> ${order.id}</p>
            <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
          </div>
         
          <div class="section">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${order.retailerName}</p>
            <p><strong>Business:</strong> ${order.businessName}</p>
            <p><strong>Location:</strong> ${order.location}</p>
          </div>

          <div class="section">
            <h3>Order Items</h3>
            ${order.itemsList.map(item => `
              <div class="item">
                <span>${item.name} x ${item.quantity}</span>
                <span>${formatCurrency(item.price * item.quantity)}</span>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <div class="item total">
              <span>Total Amount:</span>
              <span>${formatCurrency(order.totalAmount)}</span>
            </div>
          </div>

          <div class="section">
            <div class="payment-info">
              <h3>Payment Information</h3>
              <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
              <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
              ${order.paymentDetails && order.paymentDetails.transactionId ? `
                <p><strong>Transaction ID:</strong> ${order.paymentDetails.transactionId}</p>
                <p><strong>Paid At:</strong> ${order.paymentDetails.paidAt}</p>
                <p><strong>Phone Number:</strong> ${order.paymentDetails.phoneNumber}</p>
              ` : ''}
            </div>
          </div>

          <div class="section">
            <p><strong>Delivery Date:</strong> ${new Date(order.deliveryDate).toLocaleDateString()}</p>
            <p><strong>Order Status:</strong> ${order.status}</p>
          </div>

          <div class="thank-you">
            <p>Thank you for your business!</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            }
          </script>
        </body>
      </html>
    `);
    receiptWindow.document.close();
  };

  if (view === "detail" && selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={() => setView("list")}
        onPrintReceipt={handlePrintReceipt}
        formatCurrency={formatCurrency}
        getStatusInfo={getStatusInfo}
        getPaymentStatusColor={getPaymentStatusColor}
        currentUser={currentUser}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">Track your orders and view receipts</p>
          </div>
          <div className="text-sm text-gray-500">
            Orders placed via Products page will appear here
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{userOrders.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payment</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {userOrders.filter(o => o.paymentStatus === 'Pending Payment').length}
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Transit</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {userOrders.filter(o => o.status === "Dispatched").length}
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
                  {userOrders.filter(o => o.status === "Completed").length}
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
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search your orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full text-sm"
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
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your orders...</p>
          </div>
        )}

        {/* Orders Table */}
        {!isLoading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
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
                          <div className="text-xs text-gray-500">{order.items} items</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-semibold text-gray-900 text-sm">{formatCurrency(order.totalAmount)}</div>
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
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <CreditCard className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-700">{order.paymentMethod}</span>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                              {order.paymentStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(order);
                              }}
                              className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="View Details & Track"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrintReceipt(order);
                              }}
                              className="p-1 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                              title="Print Receipt"
                            >
                              <Receipt className="w-4 h-4" />
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
            {filteredOrders.length > 0 && (
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
            )}

            {/* Empty State */}
            {filteredOrders.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "You haven't placed any orders yet"}
                </p>
                <p className="text-sm text-gray-500">
                  Orders placed in the Products page will appear here automatically
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Order Detail Component with Tracking
const OrderDetail = ({ order, onBack, onPrintReceipt, formatCurrency, getStatusInfo, getPaymentStatusColor, currentUser }) => {
  const StatusIcon = getStatusInfo(order.status).icon;
  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button and Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
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
         
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPrintReceipt(order)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Receipt className="w-4 h-4" />
              <span>Print Receipt</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Payment Method</p>
                  <p className="font-semibold text-gray-900">{order.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.paymentDetails && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Transaction ID</p>
                      <p className="font-semibold text-gray-900">{order.paymentDetails.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone Number</p>
                      <p className="font-semibold text-gray-900">{order.paymentDetails.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Paid At</p>
                      <p className="font-semibold text-gray-900">{order.paymentDetails.paidAt}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Order Tracking */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Order Tracking</h3>
              </div>
             
              {/* Current Status */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <StatusIcon className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">Current Status: {order.status}</span>
                    </div>
                    <p className="text-sm text-gray-600">{statusInfo.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Tracking Updates</h4>
                {order.tracking.updates.map((update, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' :
                        index === order.tracking.updates.length - 1 ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      {index < order.tracking.updates.length - 1 && (
                        <div className="w-px h-8 bg-gray-300 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{update.status}</p>
                          <p className="text-sm text-gray-500">{update.location}</p>
                        </div>
                        <p className="text-sm text-gray-500">{update.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Information */}
              {(order.status === "Dispatched" || order.status === "Completed") && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-900">Current Location</span>
                      </div>
                      <p className="text-sm text-gray-600">{order.tracking.currentLocation}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-900">Estimated Delivery</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(order.tracking.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {order.tracking.driver && (
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-gray-900">Driver Contact</span>
                      </div>
                      <p className="text-sm text-gray-600">{order.tracking.driver}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {order.itemsList.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">Quantity: {item.quantity} • Category: {item.category}</div>
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
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Date:</span>
                  <span className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Address</h3>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{currentUser.business}</p>
                    <p className="text-sm text-gray-600">{currentUser.location}</p>
                    <p className="text-sm text-gray-500">{currentUser.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support Information */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">If you have any questions about your order:</p>
                <div className="space-y-1">
                  <p><strong>Email:</strong> support@wholesale.com</p>
                  <p><strong>Phone:</strong> +255 800 123 456</p>
                  <p><strong>Hours:</strong> Mon-Fri, 8AM-6PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;