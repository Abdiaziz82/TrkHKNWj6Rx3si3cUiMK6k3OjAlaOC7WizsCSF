import React from 'react';
import {
  Truck,
  CheckCircle,
  Clock,
  Package,
  AlertCircle,
  Receipt,
  MapPin,
  Calendar,
  CreditCard,
  User,
  ArrowLeft,
  Phone,
  Mail,
  HelpCircle
} from 'lucide-react';

const OrderDetail = ({ 
  order, 
  onBack, 
  onPrintReceipt, 
  formatCurrency, 
  getStatusInfo, 
  getPaymentStatusColor, 
  currentUser 
}) => {
  const StatusIcon = getStatusInfo(order.status).icon;
  const statusInfo = getStatusInfo(order.status);

  return (
    <div className="min-h-screen bg-gray-50/50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="group p-2.5 hover:bg-white rounded-xl transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order Details</h1>
              <p className="text-sm text-gray-500 font-medium mt-0.5">#{order.orderNumber}</p>
            </div>
          </div>
         
          <button
            onClick={() => onPrintReceipt(order)}
            className="flex items-center space-x-2.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-sm hover:shadow-md font-medium"
          >
            <Receipt className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Order Information */}
          <div className="xl:col-span-2 space-y-5">
            {/* Payment Information Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment Method</p>
                  <p className="font-semibold text-gray-900 text-lg">{order.paymentMethod}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment Status</p>
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                {order.paymentDetails && (
                  <>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Transaction ID</p>
                      <p className="font-semibold text-gray-900 font-mono text-sm">{order.paymentDetails.transactionId}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone Number</p>
                      <p className="font-semibold text-gray-900 text-lg">{order.paymentDetails.phoneNumber}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Order Tracking Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Truck className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Order Tracking</h3>
              </div>
             
              {/* Current Status Banner */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-xs">
                      <StatusIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">Current Status</p>
                      <p className="text-sm text-gray-600 mt-0.5">{statusInfo.description}</p>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusInfo.color} border border-opacity-20`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="space-y-1">
                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-4">Tracking Updates</h4>
                {order.tracking.updates.map((update, index) => (
                  <div key={index} className="flex space-x-4 group hover:bg-gray-50 rounded-lg p-2 transition-colors duration-150">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                        index === 0 ? 'bg-blue-500' :
                        index === order.tracking.updates.length - 1 ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      {index < order.tracking.updates.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-200 mt-1 group-hover:bg-gray-300 transition-colors" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{update.status}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{update.location}</p>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">{update.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Information */}
              {(order.status === "Dispatched" || order.status === "Completed") && (
                <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-gray-900 text-sm">Current Location</span>
                      </div>
                      <p className="text-sm text-gray-600">{order.tracking.currentLocation}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-gray-900 text-sm">Estimated Delivery</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(order.tracking.estimatedDelivery).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {order.tracking.driver && (
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <div className="flex items-center space-x-2 mb-1">
                        <Truck className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-gray-900 text-sm">Driver Contact</span>
                      </div>
                      <p className="text-sm text-gray-600">{order.tracking.driver}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Order Items Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
              </div>
              
              <div className="space-y-3">
                {order.itemsList.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors duration-150">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm mb-1">{item.name}</div>
                      <div className="text-xs text-gray-500">Quantity: {item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 text-sm">{formatCurrency(item.subtotal)}</div>
                      <div className="text-xs text-gray-500">{formatCurrency(item.price)} each</div>
                    </div>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-200">
                  <div className="font-bold text-gray-900 text-lg">Total Amount</div>
                  <div className="font-bold text-gray-900 text-xl">{formatCurrency(order.totalAmount)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary Cards */}
          <div className="space-y-5">
            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 hover:shadow-sm transition-shadow duration-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-5">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 font-medium">Order ID</span>
                  <span className="font-semibold text-gray-900 text-sm">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 font-medium">Order Date</span>
                  <span className="font-semibold text-gray-900 text-sm">{new Date(order.orderDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 font-medium">Delivery Date</span>
                  <span className="font-semibold text-gray-900 text-sm">{new Date(order.deliveryDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-base text-gray-900 font-semibold">Total Amount</span>
                  <span className="font-bold text-gray-900 text-lg">{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>
            </div>

            {/* Customer Information Card */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 hover:shadow-sm transition-shadow duration-200">
              <div className="flex items-center space-x-3 mb-5">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Name</p>
                  <p className="font-semibold text-gray-900">{currentUser?.name || 'Customer'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="font-semibold text-gray-900 text-sm">{currentUser?.email || order.customerEmail}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Customer ID</p>
                  <p className="font-semibold text-gray-900 font-mono text-sm">{order.customerId}</p>
                </div>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold">Need Help?</h3>
              </div>
              
              <div className="space-y-3 text-sm">
                <p className="text-gray-300 opacity-90">Our support team is here to help with your order</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">support@trkwholesale.com</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">+254 800 123 456</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs text-gray-400">Mon-Fri, 8AM-6PM EAT</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;