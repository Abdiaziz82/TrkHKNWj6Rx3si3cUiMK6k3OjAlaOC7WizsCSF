// Orders.jsx
import React, { useState, useMemo } from "react";
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
  Plus,
  X,
  Smartphone,
  Wallet,
  Phone
} from "lucide-react";

// Mock orders data for current user (Abiaziz)
const mockOrders = [
  {
    id: "ORD-001",
    customerId: "CUST-001",
    retailerName: "Abiaziz Mohammed",
    businessName: "Abiaziz Supermarket",
    orderDate: "2024-12-15",
    deliveryDate: "2024-12-18",
    totalAmount: 450000,
    items: 12,
    status: "Pending",
    priority: "Medium",
    paymentStatus: "Paid",
    paymentMethod: "M-Pesa",
    paymentDetails: {
      provider: "M-Pesa",
      phoneNumber: "+255 789 123 456",
      transactionId: "MPE123456789",
      paidAt: "2024-12-15 10:30:00"
    },
    location: "Dar es Salaam",
    itemsList: [
      { name: "Sugar 1kg", quantity: 5, price: 2500, category: "Groceries" },
      { name: "Rice 5kg", quantity: 3, price: 15000, category: "Groceries" },
      { name: "Cooking Oil 2L", quantity: 4, price: 8000, category: "Groceries" }
    ],
    tracking: {
      currentLocation: "Warehouse Dar es Salaam",
      estimatedDelivery: "2024-12-18",
      driver: "John M. - +255 789 012 345",
      updates: [
        { status: "Order Placed", timestamp: "2024-12-15 09:30", location: "Online" },
        { status: "Processing", timestamp: "2024-12-15 14:15", location: "Warehouse" }
      ]
    }
  },
  {
    id: "ORD-002",
    customerId: "CUST-001",
    retailerName: "Abiaziz Mohammed",
    businessName: "Abiaziz Supermarket",
    orderDate: "2024-12-10",
    deliveryDate: "2024-12-13",
    totalAmount: 320000,
    items: 8,
    status: "Dispatched",
    priority: "High",
    paymentStatus: "Pending",
    paymentMethod: "Cash on Delivery",
    paymentDetails: {
      provider: "Cash",
      amountDue: 320000,
      dueAt: "2024-12-13"
    },
    location: "Dar es Salaam",
    itemsList: [
      { name: "Flour 2kg", quantity: 6, price: 3000, category: "Groceries" },
      { name: "Tea Leaves 500g", quantity: 2, price: 4500, category: "Beverages" },
      { name: "Biscuits", quantity: 10, price: 1800, category: "Bakery" }
    ],
    tracking: {
      currentLocation: "In Transit - Mbezi Area",
      estimatedDelivery: "2024-12-13",
      driver: "Sarah K. - +255 712 345 678",
      updates: [
        { status: "Order Placed", timestamp: "2024-12-10 08:45", location: "Online" },
        { status: "Processing", timestamp: "2024-12-10 11:20", location: "Warehouse" },
        { status: "Dispatched", timestamp: "2024-12-12 09:15", location: "Distribution Center" },
        { status: "In Transit", timestamp: "2024-12-12 14:30", location: "Mbezi Area" }
      ]
    }
  },
  {
    id: "ORD-003",
    customerId: "CUST-001",
    retailerName: "Abiaziz Mohammed",
    businessName: "Abiaziz Supermarket",
    orderDate: "2024-12-05",
    deliveryDate: "2024-12-08",
    totalAmount: 280000,
    items: 6,
    status: "Completed",
    priority: "Medium",
    paymentStatus: "Paid",
    paymentMethod: "Airtel Money",
    paymentDetails: {
      provider: "Airtel Money",
      phoneNumber: "+255 789 123 456",
      transactionId: "AIR987654321",
      paidAt: "2024-12-05 11:15:00"
    },
    location: "Dar es Salaam",
    itemsList: [
      { name: "Bread", quantity: 10, price: 2500, category: "Bakery" },
      { name: "Milk 1L", quantity: 8, price: 2800, category: "Dairy" },
      { name: "Butter 500g", quantity: 4, price: 4800, category: "Dairy" }
    ],
    tracking: {
      currentLocation: "Delivered",
      estimatedDelivery: "2024-12-08",
      driver: "Michael T. - +255 754 321 098",
      updates: [
        { status: "Order Placed", timestamp: "2024-12-05 10:15", location: "Online" },
        { status: "Processing", timestamp: "2024-12-05 13:45", location: "Warehouse" },
        { status: "Dispatched", timestamp: "2024-12-07 08:30", location: "Distribution Center" },
        { status: "In Transit", timestamp: "2024-12-07 11:20", location: "Kinondoni" },
        { status: "Delivered", timestamp: "2024-12-08 14:10", location: "Your Location" }
      ]
    }
  }
];

// Current user information
const currentUser = {
  id: "CUST-001",
  name: "Abiaziz Mohammed",
  business: "Abiaziz Supermarket",
  location: "Dar es Salaam",
  phone: "+255 789 123 456",
  email: "abiaziz@business.com"
};

// Payment Modal Component
const PaymentModal = ({ isOpen, onClose, order, onPaymentComplete, formatCurrency }) => {
  const [selectedMethod, setSelectedMethod] = useState('M-Pesa');
  const [phoneNumber, setPhoneNumber] = useState(currentUser.phone);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState('select'); // 'select' or 'processing'

  const paymentMethods = [
    {
      id: 'M-Pesa',
      name: 'M-Pesa',
      icon: Smartphone,
      description: 'Pay via M-Pesa mobile money',
      instructions: 'Enter your M-Pesa phone number to receive payment prompt'
    },
    {
      id: 'Airtel Money',
      name: 'Airtel Money',
      icon: Smartphone,
      description: 'Pay via Airtel Money',
      instructions: 'Enter your Airtel Money phone number to receive payment prompt'
    },
    {
      id: 'Tigo Pesa',
      name: 'Tigo Pesa',
      icon: Smartphone,
      description: 'Pay via Tigo Pesa',
      instructions: 'Enter your Tigo Pesa phone number to receive payment prompt'
    }
  ];

  const validatePhoneNumber = (phone) => {
    const tanzaniaRegex = /^(\+255|0)[1-9]\d{8}$/;
    return tanzaniaRegex.test(phone);
  };

  const handleInitiatePayment = () => {
    if (!validatePhoneNumber(phoneNumber)) {
      alert('Please enter a valid Tanzanian phone number (e.g., +255712345678 or 0712345678)');
      return;
    }
    setPaymentStep('processing');
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing delay
    setTimeout(() => {
      const paymentData = {
        provider: selectedMethod,
        phoneNumber: phoneNumber,
        transactionId: `${selectedMethod.substring(0, 3).toUpperCase()}${Date.now()}`,
        paidAt: new Date().toLocaleString()
      };
      
      onPaymentComplete(paymentData);
      setIsProcessing(false);
      setPaymentStep('select');
      onClose();
    }, 3000);
  };

  const handleBackToSelection = () => {
    setPaymentStep('select');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {paymentStep === 'select' ? 'Complete Payment' : 'Processing Payment'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isProcessing}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Order Summary</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Total:</span>
              <span className="text-lg font-bold text-gray-900">{formatCurrency(order.totalAmount)}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">Order ID: {order.id}</div>
          </div>

          {paymentStep === 'select' ? (
            <>
              {/* Payment Methods */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Select Payment Method</h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <label key={method.id} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedMethod === method.id}
                          onChange={(e) => setSelectedMethod(e.target.value)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div className="ml-3 flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-green-600" />
                          <div>
                            <span className="font-medium text-gray-900">{method.name}</span>
                            <p className="text-sm text-gray-500">{method.description}</p>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Phone Number Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  {selectedMethod} Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g., +255712345678 or 0712345678"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {paymentMethods.find(m => m.id === selectedMethod)?.instructions}
                </p>
                {phoneNumber && !validatePhoneNumber(phoneNumber) && (
                  <p className="text-sm text-red-600 mt-1">
                    Please enter a valid Tanzanian phone number
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleInitiatePayment}
                  disabled={!phoneNumber || !validatePhoneNumber(phoneNumber)}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Continue to Pay</span>
                </button>
              </div>
            </>
          ) : (
            /* Payment Processing Screen */
            <div className="text-center space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Check Your Phone
                </h3>
                <p className="text-gray-600 mb-4">
                  We've sent a payment request to <strong>{phoneNumber}</strong>
                </p>
                <div className="bg-white rounded-lg p-4 border">
                  <p className="text-sm text-gray-600">Amount to Pay</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                  <p className="text-sm text-gray-500 mt-1">via {selectedMethod}</p>
                </div>
              </div>

              {/* Simulated Payment Steps */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isProcessing ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {isProcessing ? '1' : <CheckCircle className="w-4 h-4" />}
                  </div>
                  <span className={isProcessing ? 'text-gray-600' : 'text-green-600'}>
                    Payment request sent to your phone
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isProcessing ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {isProcessing ? '2' : <CheckCircle className="w-4 h-4" />}
                  </div>
                  <span className={isProcessing ? 'text-gray-600' : 'text-green-600'}>
                    Enter your PIN to authorize payment
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isProcessing ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {isProcessing ? '3' : <CheckCircle className="w-4 h-4" />}
                  </div>
                  <span className={isProcessing ? 'text-gray-600' : 'text-green-600'}>
                    Payment confirmation
                  </span>
                </div>
              </div>

              {isProcessing && (
                <div className="flex items-center justify-center space-x-2 text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span>Waiting for payment confirmation...</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <button
                  onClick={handleBackToSelection}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  disabled={isProcessing}
                >
                  Back
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>I've Completed Payment</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> This is a simulation. In a real app, this would integrate with actual mobile money APIs.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Order Modal Component
const OrderModal = ({ isOpen, onClose, onSubmit, formatCurrency }) => {
  const [formData, setFormData] = useState({
    items: [{ name: '', quantity: 1, price: 0, category: 'Groceries' }],
    paymentMethod: 'M-Pesa',
    specialInstructions: ''
  });

  const products = [
    { name: "Sugar 1kg", price: 2500, category: "Groceries" },
    { name: "Rice 5kg", price: 15000, category: "Groceries" },
    { name: "Cooking Oil 2L", price: 8000, category: "Groceries" },
    { name: "Flour 2kg", price: 3000, category: "Groceries" },
    { name: "Tea Leaves 500g", price: 4500, category: "Beverages" },
    { name: "Bread", price: 2500, category: "Bakery" },
    { name: "Milk 1L", price: 2800, category: "Dairy" },
    { name: "Soap Bar", price: 1500, category: "Personal Care" },
    { name: "Toothpaste", price: 3200, category: "Personal Care" },
    { name: "Bottled Water 500ml", price: 600, category: "Beverages" },
    { name: "Biscuits", price: 1800, category: "Bakery" },
    { name: "Cooking Gas 6kg", price: 45000, category: "Household" }
  ];

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0, category: 'Groceries' }]
    }));
  };

  const removeItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    
    // Auto-fill price when product is selected
    if (field === 'name' && value) {
      const selectedProduct = products.find(p => p.name === value);
      if (selectedProduct) {
        updatedItems[index].price = selectedProduct.price;
        updatedItems[index].category = selectedProduct.category;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderData = {
      ...formData,
      totalAmount: calculateTotal(),
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      paymentStatus: formData.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Pending Payment'
    };
    onSubmit(orderData);
    onClose();
    // Reset form
    setFormData({
      items: [{ name: '', quantity: 1, price: 0, category: 'Groceries' }],
      paymentMethod: 'M-Pesa',
      specialInstructions: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Place New Order</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                    <select
                      value={item.name}
                      onChange={(e) => updateItem(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    >
                      <option value="">Select a product</option>
                      {products.map((product, idx) => (
                        <option key={idx} value={product.name}>
                          {product.name} - {formatCurrency(product.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <input
                      type="text"
                      value={formatCurrency(item.price)}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                    <div className="px-3 py-2 bg-gray-50 rounded-lg text-sm font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                  
                  <div className="md:col-span-1 flex items-end">
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="w-full p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addItem}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Item</span>
              </button>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="M-Pesa"
                  checked={formData.paymentMethod === 'M-Pesa'}
                  onChange={(e) => updateField('paymentMethod', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="font-medium text-gray-900">M-Pesa</span>
                  <p className="text-sm text-gray-500">Pay now via M-Pesa</p>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Airtel Money"
                  checked={formData.paymentMethod === 'Airtel Money'}
                  onChange={(e) => updateField('paymentMethod', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="font-medium text-gray-900">Airtel Money</span>
                  <p className="text-sm text-gray-500">Pay now via Airtel Money</p>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Tigo Pesa"
                  checked={formData.paymentMethod === 'Tigo Pesa'}
                  onChange={(e) => updateField('paymentMethod', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="font-medium text-gray-900">Tigo Pesa</span>
                  <p className="text-sm text-gray-500">Pay now via Tigo Pesa</p>
                </div>
              </label>
              
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  checked={formData.paymentMethod === 'Cash on Delivery'}
                  onChange={(e) => updateField('paymentMethod', e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <span className="font-medium text-gray-900">Cash on Delivery</span>
                  <p className="text-sm text-gray-500">Pay when you receive your order</p>
                </div>
              </label>
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              value={formData.specialInstructions}
              onChange={(e) => updateField('specialInstructions', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any special delivery instructions or notes..."
            />
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold text-gray-900">Order Total</div>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(calculateTotal())}
              </div>
            </div>
            
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Delivery estimated in 3 business days</p>
              <p>• Free delivery for orders above TZS 200,000</p>
              <p>• {formData.paymentMethod === 'Cash on Delivery' ? 'Pay when your order arrives' : 'Complete payment to confirm your order'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                {formData.paymentMethod === 'Cash on Delivery' ? 'Place Order' : 'Continue to Payment'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [view, setView] = useState("list");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingPaymentOrder, setPendingPaymentOrder] = useState(null);
  const [orders, setOrders] = useState(mockOrders);
  const itemsPerPage = 6;

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

  const handleNewOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${String(orders.length + 1).padStart(3, '0')}`,
      customerId: currentUser.id,
      retailerName: currentUser.name,
      businessName: currentUser.business,
      orderDate: orderData.orderDate,
      deliveryDate: orderData.deliveryDate,
      totalAmount: orderData.totalAmount,
      items: orderData.items.length,
      status: "Pending",
      priority: "Medium",
      paymentStatus: orderData.paymentStatus,
      paymentMethod: orderData.paymentMethod,
      location: currentUser.location,
      itemsList: orderData.items,
      tracking: {
        currentLocation: "Order Received",
        estimatedDelivery: orderData.deliveryDate,
        driver: "Not assigned yet",
        updates: [
          { status: "Order Placed", timestamp: new Date().toLocaleString(), location: "Online" }
        ]
      }
    };

    // If it's mobile payment, show payment modal
    if (orderData.paymentMethod !== 'Cash on Delivery') {
      setPendingPaymentOrder(newOrder);
      setShowPaymentModal(true);
    } else {
      // For cash on delivery, just add the order
      setOrders(prev => [newOrder, ...prev]);
    }
  };

  const handlePaymentComplete = (paymentData) => {
    if (pendingPaymentOrder) {
      const updatedOrder = {
        ...pendingPaymentOrder,
        paymentStatus: 'Paid',
        paymentDetails: paymentData
      };
      
      setOrders(prev => [updatedOrder, ...prev]);
      setPendingPaymentOrder(null);
    }
  };

  const handleMakePayment = (order) => {
    setPendingPaymentOrder(order);
    setShowPaymentModal(true);
  };

  if (view === "detail" && selectedOrder) {
    return (
      <OrderDetail 
        order={selectedOrder}
        onBack={() => setView("list")}
        onPrintReceipt={handlePrintReceipt}
        onMakePayment={handleMakePayment}
        formatCurrency={formatCurrency}
        getStatusInfo={getStatusInfo}
        getPaymentStatusColor={getPaymentStatusColor}
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
            <p className="text-gray-600 mt-1">Track your orders and place new ones</p>
          </div>
          <button 
            onClick={() => setShowOrderModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Package className="w-5 h-5" />
            <span>Make an Order</span>
          </button>
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

        {/* Orders Table */}
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
                          {order.paymentStatus === 'Pending Payment' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMakePayment(order);
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Complete Payment
                            </button>
                          )}
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
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "You haven't placed any orders yet"}
              </p>
              <button
                onClick={() => setShowOrderModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Place Your First Order
              </button>
            </div>
          )}
        </div>

        {/* Order Modal */}
        <OrderModal 
          isOpen={showOrderModal}
          onClose={() => setShowOrderModal(false)}
          onSubmit={handleNewOrder}
          formatCurrency={formatCurrency}
        />

        {/* Payment Modal */}
        <PaymentModal 
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setPendingPaymentOrder(null);
          }}
          order={pendingPaymentOrder}
          onPaymentComplete={handlePaymentComplete}
          formatCurrency={formatCurrency}
        />
      </div>
    </div>
  );
};

// Order Detail Component with Tracking
const OrderDetail = ({ order, onBack, onPrintReceipt, onMakePayment, formatCurrency, getStatusInfo, getPaymentStatusColor }) => {
  const StatusIcon = getStatusInfo(order.status).icon;
  const statusInfo = getStatusInfo(order.status);

  const statusSteps = [
    { status: "Pending", label: "Order Placed", completed: true },
    { status: "Approved", label: "Approved", completed: ["Approved", "Dispatched", "Completed"].includes(order.status) },
    { status: "Dispatched", label: "Dispatched", completed: ["Dispatched", "Completed"].includes(order.status) },
    { status: "Completed", label: "Delivered", completed: order.status === "Completed" }
  ];

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
            {order.paymentStatus === 'Pending Payment' && (
              <button
                onClick={() => onMakePayment(order)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Wallet className="w-4 h-4" />
                <span>Complete Payment</span>
              </button>
            )}
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
              {order.paymentStatus === 'Pending Payment' && (
                <div className="mt-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Payment Required</p>
                      <p className="text-sm text-gray-600">Complete payment to confirm your order</p>
                    </div>
                    <button
                      onClick={() => onMakePayment(order)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              )}
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