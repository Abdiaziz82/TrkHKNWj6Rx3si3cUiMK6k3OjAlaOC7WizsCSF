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
  CreditCard,
  User
} from "lucide-react";
import OrderDetail from './OrderDetail';

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("list");
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const itemsPerPage = 6;

  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch current user and orders
  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user data from localStorage or token
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentUser(userData);

        // Fetch orders from API
        const response = await fetch(`${API_BASE_URL}/orders`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
          // Transform API data to match our frontend structure
          const transformedOrders = result.orders.map(order => {
            const orderDate = new Date(order.created_at);
            const deliveryDate = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 days
            
            // Determine status mapping
            let status = "Pending";
            if (order.status === 'processing' || order.status === 'payment_initiated') {
              status = "Processing";
            } else if (order.status === 'paid') {
              status = "Approved";
            } else if (order.status === 'shipped') {
              status = "Dispatched";
            } else if (order.status === 'delivered') {
              status = "Completed";
            } else if (order.status === 'cancelled') {
              status = "Cancelled";
            }

            // Determine payment status
            let paymentStatus = "Pending";
            if (order.status === 'paid' || order.status === 'payment_initiated') {
              paymentStatus = "Paid";
            } else if (order.payment_method === 'cash_on_delivery') {
              paymentStatus = "Pending";
            }

            return {
              id: order.id,
              orderNumber: `ORD-${String(order.id).padStart(3, '0')}`,
              customerId: order.customer_id,
              customerEmail: order.customer,
              orderDate: orderDate.toISOString().split('T')[0],
              deliveryDate: deliveryDate.toISOString().split('T')[0],
              totalAmount: parseFloat(order.total_amount),
              items: order.total_quantity,
              status: status,
              paymentMethod: order.payment_method === 'mpesa' ? 'M-Pesa' : 
                           order.payment_method === 'cash_on_delivery' ? 'Cash on Delivery' : 
                           order.payment_method,
              paymentStatus: paymentStatus,
              paymentDetails: order.mpesa_phone_number ? {
                provider: 'M-Pesa',
                phoneNumber: order.mpesa_phone_number,
                transactionId: order.mpesa_checkout_request_id || `MPE${order.id}`,
                paidAt: orderDate.toLocaleString()
              } : null,
              itemsList: order.items ? order.items.map(item => ({
                name: item.product,
                quantity: item.quantity,
                price: parseFloat(item.price),
                subtotal: parseFloat(item.subtotal),
                category: "Product"
              })) : [],
              tracking: {
                currentLocation: status === "Approved" ? "Warehouse Processing" : "Order Received",
                estimatedDelivery: deliveryDate.toISOString().split('T')[0],
                driver: status === "Approved" ? "John M. - +254 789 012 345" : "Not assigned yet",
                updates: [
                  { 
                    status: "Order Placed", 
                    timestamp: orderDate.toLocaleString(), 
                    location: "Online" 
                  },
                  ...(status === "Approved" ? [{
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
        } else {
          throw new Error(result.message || 'Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndOrders();
  }, []);

  // Filter orders based on search and filters
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
     
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
     
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, orders]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format currency in KSH
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case "Pending":
        return { color: "bg-yellow-100 text-yellow-800", icon: Clock, description: "Your order is being processed" };
      case "Processing":
        return { color: "bg-blue-100 text-blue-800", icon: Clock, description: "Payment is being processed" };
      case "Approved":
        return { color: "bg-green-100 text-green-800", icon: CheckCircle, description: "Order approved and ready for dispatch" };
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
          <title>Receipt - ${order.orderNumber}</title>
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
            <h2>TrkWholesale</h2>
            <p><strong>Receipt ID:</strong> ${order.orderNumber}</p>
            <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
          </div>
         
          <div class="section">
            <h3>Customer Information</h3>
            <p><strong>Name:</strong> ${currentUser?.name || 'Customer'}</p>
            <p><strong>Email:</strong> ${currentUser?.email || order.customerEmail}</p>
            <p><strong>Order ID:</strong> ${order.id}</p>
          </div>

          <div class="section">
            <h3>Order Items</h3>
            ${order.itemsList.map(item => `
              <div class="item">
                <span>${item.name} x ${item.quantity}</span>
                <span>${formatCurrency(item.subtotal)}</span>
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
              ${order.paymentDetails ? `
                <p><strong>Transaction ID:</strong> ${order.paymentDetails.transactionId}</p>
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
    <div className="min-h-screen bg-gray-50 p-2 font">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">Track your orders and view receipts</p>
          </div>
          {currentUser && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{currentUser.name || currentUser.email}</span>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{orders.length}</p>
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
                  {orders.filter(o => o.paymentStatus === 'Pending Payment').length}
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
                  {orders.filter(o => o.status === "Dispatched").length}
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
                  {orders.filter(o => o.status === "Completed").length}
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
              <option value="Processing">Processing</option>
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
                          <div className="font-semibold text-gray-900 text-sm">{order.orderNumber}</div>
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

export default Orders;