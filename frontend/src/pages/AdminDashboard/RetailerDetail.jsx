import React from "react";
import { 
  UserCircle, 
  Edit, 
  MoreVertical,
  Star,
  CreditCard,
  ShoppingCart,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

function RetailerDetail({ retailer, onBack, orderHistory, formatCurrency, getCreditStatusColor }) {
  const creditUtilization = (retailer.creditUsed / retailer.creditLimit) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Back Button and Header */}
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Retailer Profile</h1>
            <p className="text-gray-600 text-sm">Detailed information and history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Profile Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {retailer.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{retailer.name}</h2>
                      <p className="text-gray-600">{retailer.businessName}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCreditStatusColor(retailer.creditStatus)}`}>
                          {retailer.creditStatus}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          retailer.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}>
                          {retailer.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 text-sm">{retailer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 text-sm">{retailer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 text-sm">{retailer.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <UserCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 text-sm">Member since {new Date(retailer.registrationDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Credit Status Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Credit Status</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Credit Utilization</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(retailer.creditUsed)} / {formatCurrency(retailer.creditLimit)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        creditUtilization < 50 ? 'bg-green-500' :
                        creditUtilization < 80 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(creditUtilization, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>{Math.round(creditUtilization)}%</span>
                    <span>100%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{retailer.totalOrders}</div>
                    <div className="text-xs text-gray-600">Total Orders</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{formatCurrency(retailer.totalSpent)}</div>
                    <div className="text-xs text-gray-600">Total Spent</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Orders</h3>
              <div className="space-y-2">
                {orderHistory.map(order => (
                  <div key={order.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">Order #{order.id}</div>
                      <div className="text-xs text-gray-600">{new Date(order.date).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 text-sm">{formatCurrency(order.amount)}</div>
                      <div className="text-xs text-gray-600">{order.items} items</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Loyalty */}
          <div className="space-y-4">
            {/* Loyalty Points */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Loyalty Points</h3>
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-white fill-current" />
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{retailer.loyaltyPoints}</div>
                <div className="text-gray-600 text-sm">Total Points</div>
                <div className="mt-2 text-xs text-gray-500">
                  {retailer.loyaltyPoints >= 2000 ? "Gold Tier" :
                   retailer.loyaltyPoints >= 1000 ? "Silver Tier" : "Bronze Tier"}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 p-2 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors text-sm">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  <span>View All Orders</span>
                </button>
                <button className="w-full flex items-center space-x-2 p-2 text-left border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors text-sm">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span>Adjust Credit Limit</span>
                </button>
                <button className="w-full flex items-center space-x-2 p-2 text-left border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors text-sm">
                  <Star className="w-4 h-4 text-purple-600" />
                  <span>Manage Loyalty</span>
                </button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Order Frequency</span>
                    <span className="text-sm font-semibold text-gray-900">Weekly</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Avg Order Value</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(retailer.totalSpent / retailer.totalOrders)}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Last Order</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {new Date(retailer.lastOrder).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RetailerDetail;