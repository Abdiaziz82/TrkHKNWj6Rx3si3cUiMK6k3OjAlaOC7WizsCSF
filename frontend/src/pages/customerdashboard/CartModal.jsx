import React, { useState } from 'react';
import { 
  FiX, FiPlus, FiMinus, FiCheck, FiShoppingCart, 
  FiSmartphone, FiTruck, FiArrowLeft 
} from 'react-icons/fi';

const CartModal = ({ 
  cart, 
  onClose, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  onCheckoutSuccess 
}) => {
  const [paymentStep, setPaymentStep] = useState('cart');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const API_BASE_URL = 'http://localhost:5000/api';

  const formatPrice = (price) => `$${Number(price).toFixed(2)}`;

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.16; // 16% tax
  };

  const getShipping = () => {
    return getSubtotal() > 50 ? 0 : 5.99; // Free shipping over $50
  };

  const getGrandTotal = () => {
    return getSubtotal() + getTax() + getShipping();
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handlePaymentMethodSelect = (method) => {
    if (method === 'cash') {
      handleCashOnDelivery();
    } else {
      setPaymentStep(method);
    }
  };

const handleMpesaPayment = async () => {
  if (!phoneNumber.trim()) {
    setErrorMessage('Please enter your phone number');
    return;
  }

  // Validate phone number format
  const cleanedPhone = phoneNumber.replace(/\s+/g, '');
  if (!/^(07\d{8}|2547\d{8}|01\d{8})$/.test(cleanedPhone)) {
    setErrorMessage('Please enter a valid Kenyan phone number');
    return;
  }

  setIsProcessing(true);
  setErrorMessage('');

  try {
    const orderData = {
      phone_number: cleanedPhone,
      amount: parseFloat(getGrandTotal()), // Ensure this is a number, not string
      items: cart.map(item => ({
        product_id: item.id,
        quantity: parseInt(item.quantity), // Ensure integer
        price: parseFloat(item.price) // Ensure float
      }))
    };

    console.log('Sending order data:', orderData); // Debug log

    const response = await fetch(`${API_BASE_URL}/orders/mpesa-stk-push`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'M-Pesa payment failed');
    }

    if (result.success) {
      console.log('M-Pesa STK Push initiated:', result);
      setPaymentStep('success');
      
      // Clear cart and redirect after success
      setTimeout(() => {
        onCheckoutSuccess();
      }, 3000);
    } else {
      throw new Error(result.message || 'M-Pesa payment failed');
    }

  } catch (error) {
    console.error('M-Pesa payment error:', error);
    setErrorMessage(error.message || 'Payment failed. Please try again.');
  } finally {
    setIsProcessing(false);
  }
};
  const handleCashOnDelivery = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      const orderData = {
        amount: getGrandTotal(),
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const response = await fetch(`${API_BASE_URL}/orders/cash-on-delivery`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Order creation failed');
      }

      if (result.success) {
        setPaymentStep('success');
        
        // Clear cart and redirect after success
        setTimeout(() => {
          onCheckoutSuccess();
        }, 3000);
      } else {
        throw new Error(result.message || 'Order creation failed');
      }

    } catch (error) {
      console.error('Cash order error:', error);
      setErrorMessage(error.message || 'Order failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetPaymentFlow = () => {
    setPaymentStep('cart');
    setPhoneNumber('');
    setErrorMessage('');
    setIsProcessing(false);
  };

  const renderPaymentStep = () => {
    switch (paymentStep) {
      case 'cart':
        return renderCartItems();
      case 'payment-method':
        return renderPaymentMethods();
      case 'mpesa':
        return renderMpesaPayment();
      case 'success':
        return renderSuccess();
      default:
        return renderCartItems();
    }
  };

  const renderCartItems = () => (
    <>
      <div className="p-6 overflow-y-auto max-h-96">
        {cart.length === 0 ? (
          <div className="text-center py-8">
            <FiShoppingCart className="mx-auto text-gray-300 text-4xl mb-3" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{formatPrice(item.price)} each</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <FiMinus className="text-sm" />
                    </button>
                    <span className="font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-1 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
                    >
                      <FiPlus className="text-sm" />
                    </button>
                  </div>
                  
                  <span className="font-semibold text-blue-600 w-20 text-right">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="p-1 hover:bg-red-100 text-red-500 rounded transition-colors"
                  >
                    <FiX className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="border-t border-gray-200 p-6">
          {/* Price Breakdown */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(getSubtotal())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (16%)</span>
              <span className="font-medium">{formatPrice(getTax())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {getShipping() === 0 ? 'Free' : formatPrice(getShipping())}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-blue-600">{formatPrice(getGrandTotal())}</span>
            </div>
          </div>

          <button
            onClick={() => setPaymentStep('payment-method')}
            className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={onClose}
            className="w-full mt-3 py-2 text-blue-500 font-medium hover:bg-blue-50 rounded-lg transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </>
  );

  const renderPaymentMethods = () => (
    <div className="p-6">
      <button
        onClick={resetPaymentFlow}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
      >
        <FiArrowLeft className="text-sm" />
        Back to Cart
      </button>

      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
      
      <div className="space-y-3">
        <button
          onClick={() => handlePaymentMethodSelect('mpesa')}
          className="w-full flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
        >
          <div className="p-2 bg-green-500 text-white rounded-lg">
            <FiSmartphone className="text-xl" />
          </div>
          <div className="text-left flex-1">
            <div className="font-semibold text-green-900">M-Pesa</div>
            <div className="text-sm text-green-600">Pay with mobile money</div>
          </div>
        </button>

        <button
          onClick={() => handlePaymentMethodSelect('cash')}
          className="w-full flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="p-2 bg-gray-500 text-white rounded-lg">
            <FiTruck className="text-xl" />
          </div>
          <div className="text-left flex-1">
            <div className="font-semibold text-gray-900">Cash on Delivery</div>
            <div className="text-sm text-gray-600">Pay when you receive your order</div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderMpesaPayment = () => (
    <div className="p-6">
      <button
        onClick={() => setPaymentStep('payment-method')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
      >
        <FiArrowLeft className="text-sm" />
        Back to Payment Methods
      </button>

      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <FiSmartphone className="text-2xl text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pay with M-Pesa</h3>
        <p className="text-gray-600 text-sm">Enter your M-Pesa phone number</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="07XX XXX XXX"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
          <p className="text-xs text-gray-500 mt-1">Enter your Safaricom number</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-green-800">Total Amount:</span>
            <span className="font-semibold text-green-900">{formatPrice(getGrandTotal())}</span>
          </div>
          <p className="text-xs text-green-700">
            You will receive a prompt on your phone to complete the payment.
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        <button
          onClick={handleMpesaPayment}
          disabled={isProcessing}
          className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-green-300 transition-colors flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Initiating Payment...
            </>
          ) : (
            'Pay with M-Pesa'
          )}
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <FiCheck className="text-2xl text-green-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Placed Successfully!</h3>
      <p className="text-gray-600 mb-6">
        {paymentStep === 'mpesa' 
          ? 'M-Pesa payment initiated. Check your phone to complete payment.' 
          : 'Your order has been placed successfully.'}
        Redirecting to your orders...
      </p>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
    </div>
  );

  const getModalTitle = () => {
    switch (paymentStep) {
      case 'cart': return 'Shopping Cart';
      case 'payment-method': return 'Payment Method';
      case 'mpesa': return 'M-Pesa Payment';
      case 'success': return 'Order Successful';
      default: return 'Shopping Cart';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {getModalTitle()}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetPaymentFlow();
            }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX className="text-xl text-gray-500" />
          </button>
        </div>

        {/* Content */}
        {renderPaymentStep()}
      </div>
    </div>
  );
};

export default CartModal;