import React from "react";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

// Cash Flow Chart Component
const CashFlowChart = ({ data, formatCurrency }) => {
  const maxValue = Math.max(...data.map(item => Math.max(item.inflows, item.outflows)));
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Cash Flow Analysis</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Daily Overview</span>
        </div>
      </div>
      
      <div className="flex items-end justify-between h-48 space-x-1 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1 space-y-1">
            <div className="text-xs text-gray-500">{new Date(item.date).getDate()}</div>
            
            {/* Inflows Bar */}
            <div
              className="w-full bg-gradient-to-t from-green-500 to-green-600 rounded-t-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 cursor-pointer"
              style={{ 
                height: `${(item.inflows / maxValue) * 100}%`,
                minHeight: '4px'
              }}
              title={`Inflows: ${formatCurrency(item.inflows)}`}
            />
            
            {/* Outflows Bar */}
            <div
              className="w-full bg-gradient-to-t from-red-500 to-red-600 rounded-t-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 cursor-pointer"
              style={{ 
                height: `${(item.outflows / maxValue) * 100}%`,
                minHeight: '4px'
              }}
              title={`Outflows: ${formatCurrency(item.outflows)}`}
            />
            
            <div className="text-xs text-gray-600 mt-1">
              {formatCurrency(item.net).replace('TZS', '').trim()}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center space-x-6 mt-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600">Inflows</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-600">Outflows</span>
        </div>
      </div>
    </div>
  );
};

// Payment Methods Chart
const PaymentMethodsChart = ({ ledgerData, formatCurrency }) => {
  const paymentSummary = {
    cash: ledgerData.filter(item => item.paymentMethod === 'cash').reduce((sum, item) => sum + item.amount, 0),
    mobile_money: ledgerData.filter(item => item.paymentMethod === 'mobile_money').reduce((sum, item) => sum + item.amount, 0),
    credit: ledgerData.filter(item => item.paymentMethod === 'credit').reduce((sum, item) => sum + item.amount, 0)
  };

  const total = Object.values(paymentSummary).reduce((sum, amount) => sum + amount, 0);
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mt-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods Distribution</h3>
      
      <div className="space-y-3">
        {Object.entries(paymentSummary).map(([method, amount]) => {
          const percentage = total > 0 ? (amount / total) * 100 : 0;
          const methodConfig = {
            cash: { color: 'bg-gray-500', label: 'Cash' },
            mobile_money: { color: 'bg-purple-500', label: 'Mobile Money' },
            credit: { color: 'bg-blue-500', label: 'Credit' }
          };
          
          const config = methodConfig[method] || methodConfig.cash;
          
          return (
            <div key={method} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-900">{config.label}</span>
                <span className="text-sm text-gray-600">{formatCurrency(amount)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${config.color} transition-all duration-300`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 text-right">{percentage.toFixed(1)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Credit Status Chart
const CreditStatusChart = ({ ledgerData, formatCurrency }) => {
  const creditData = ledgerData.filter(item => item.paymentMethod === 'credit');
  const statusSummary = {
    paid: creditData.filter(item => item.status === 'paid').reduce((sum, item) => sum + item.paidAmount, 0),
    pending: creditData.filter(item => item.status === 'pending').reduce((sum, item) => sum + item.remainingAmount, 0),
    overdue: creditData.filter(item => item.status === 'overdue').reduce((sum, item) => sum + item.remainingAmount, 0)
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mt-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Credit Sales Status</h3>
      
      <div className="space-y-4">
        {Object.entries(statusSummary).map(([status, amount]) => {
          const statusConfig = {
            paid: { color: 'bg-green-100 text-green-800', label: 'Paid', icon: TrendingUp },
            pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending', icon: Calendar },
            overdue: { color: 'bg-red-100 text-red-800', label: 'Overdue', icon: TrendingDown }
          };
          
          const config = statusConfig[status] || statusConfig.pending;
          const Icon = config.icon;
          
          return (
            <div key={status} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 ${config.color.split(' ')[0]} rounded-lg`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{config.label}</div>
                  <div className="text-xs text-gray-500">{creditData.filter(item => item.status === status).length} transactions</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900 text-sm">{formatCurrency(amount)}</div>
                <div className={`text-xs ${config.color}`}>
                  {status === 'paid' ? 'Collected' : status === 'pending' ? 'Expected' : 'Delayed'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main Payment Charts Component
const PaymentCharts = ({ cashFlowData, ledgerData, timeRange, setTimeRange, formatCurrency }) => (
  <div>
    <CashFlowChart data={cashFlowData} formatCurrency={formatCurrency} />
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
      <PaymentMethodsChart ledgerData={ledgerData} formatCurrency={formatCurrency} />
      <CreditStatusChart ledgerData={ledgerData} formatCurrency={formatCurrency} />
    </div>
  </div>
);

export default PaymentCharts;