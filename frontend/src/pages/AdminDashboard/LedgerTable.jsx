import React from "react";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Truck,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown
} from "lucide-react";

const LedgerTable = ({
  data = [],
  filterStatus,
  setFilterStatus,
  filterPaymentMethod,
  setFilterPaymentMethod,
  searchTerm,
  setSearchTerm,
  formatCurrency
}) => {
  const tableData = Array.isArray(data) ? data : [];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'partial': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-blue-600" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Table filters and search */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
            
            <select
              value={filterPaymentMethod}
              onChange={(e) => setFilterPaymentMethod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="cash">Cash</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="credit">Credit</option>
            </select>
          </div>
          
          <div className="flex-1 md:max-w-xs">
            <input
              type="text"
              placeholder="Search order ID, retailer, business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Financials
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payments
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profit Analysis
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status & Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tableData.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  No orders found matching your filters.
                </td>
              </tr>
            ) : (
              tableData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {/* Order Details */}
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <div>
                        <div className="font-semibold text-gray-900">{item.orderId}</div>
                        <div className="text-sm text-gray-500">{item.retailer}</div>
                        <div className="text-sm text-gray-400">{item.business} • {item.location}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        <div>Order: {item.orderDate}</div>
                        <div>Due: {item.dueDate}</div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium">Items:</div>
                        {item.orderItems.slice(0, 2).map((order, idx) => (
                          <div key={idx}>• {order.product} ({order.quantity})</div>
                        ))}
                        {item.orderItems.length > 2 && (
                          <div className="text-blue-600">+{item.orderItems.length - 2} more items</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Financials */}
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          Total: {formatCurrency(item.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Cost: {formatCurrency(item.costDetails.totalCost)}
                        </div>
                      </div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Product Cost:</span>
                          <span>{formatCurrency(item.costDetails.productCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Delivery:</span>
                          <span>{formatCurrency(item.costDetails.deliveryCost)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax & Charges:</span>
                          <span>{formatCurrency(item.costDetails.tax + item.costDetails.otherCharges)}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Payments */}
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <div className="text-green-600 font-semibold">
                          Paid: {formatCurrency(item.paidAmount)}
                        </div>
                        <div className="text-red-600 font-semibold">
                          Due: {formatCurrency(item.remainingAmount)}
                        </div>
                      </div>
                      <div className="text-xs">
                        <div className="font-medium">Payment History:</div>
                        {item.paymentHistory.length > 0 ? (
                          item.paymentHistory.slice(0, 2).map((payment, idx) => (
                            <div key={idx} className="text-gray-600">
                              {payment.date}: {formatCurrency(payment.amount)} ({payment.method})
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400">No payments yet</div>
                        )}
                        {item.paymentHistory.length > 2 && (
                          <div className="text-blue-600">+{item.paymentHistory.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Profit Analysis */}
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <div className={`flex items-center space-x-1 text-sm font-semibold ${
                        item.profit > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.profit > 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span>Profit: {formatCurrency(item.profit)}</span>
                      </div>
                      <div className="text-xs text-gray-600">
                        Margin: {item.profitMargin}
                      </div>
                      <div className="text-xs">
                        <div className="font-medium">Discrepancies:</div>
                        {item.discrepancies.length > 0 ? (
                          item.discrepancies.map((disc, idx) => (
                            <div key={idx} className="text-red-600">
                              • {disc.description}
                            </div>
                          ))
                        ) : (
                          <div className="text-green-600">No issues</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Status & Actions */}
                  <td className="px-4 py-4">
                    <div className="space-y-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{item.status}</span>
                      </span>
                      
                      <div className="text-xs text-gray-600">
                        <div className="font-medium">Method: {item.paymentMethod}</div>
                      </div>

                      {item.notes && (
                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                          {item.notes}
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                          View Details
                        </button>
                        {item.remainingAmount > 0 && (
                          <button className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700">
                            Record Payment
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LedgerTable;