import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPackage, FiImage, FiFilter, FiBox, FiDollarSign, FiCalendar, 
  FiTrendingUp, FiShoppingCart, FiX, FiPlus, FiMinus, FiCheck,
  FiCreditCard, FiSmartphone, FiTruck, FiArrowLeft
} from 'react-icons/fi';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('cart'); // 'cart', 'payment-method', 'mpesa', 'airtel', 'success'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const API_BASE_URL = 'http://localhost:5000/api/products';

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const uniqueCategories = [...new Set(products
        .map(product => product.category)
        .filter(category => category && category.trim() !== '')
      )].sort();
      setCategories(uniqueCategories);
    }
  }, [products]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
      
      const result = await response.json();
      if (result.success) {
        setProducts(result.products);
      } else {
        throw new Error(result.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cart functions
  const addToCart = (product) => {
    if (product.stock === 0) return;
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        if (existingItem.quantity >= product.stock) return prevCart;
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

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

  const handlePaymentMethodSelect = (method) => {
    if (method === 'cash') {
      handleCheckout('Cash on Delivery');
    } else {
      setPaymentStep(method);
    }
  };

  const handleMobilePayment = async (method) => {
    if (!phoneNumber.trim()) {
      alert('Please enter your phone number');
      return;
    }

    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      handleCheckout(method);
    }, 3000);
  };

  const handleCheckout = async (paymentMethod) => {
    try {
      const orderData = {
        items: cart,
        total: getGrandTotal(),
        paymentMethod,
        phoneNumber: paymentMethod.includes('M-Pesa') || paymentMethod.includes('Airtel') ? phoneNumber : null,
        status: paymentMethod === 'Cash on Delivery' ? 'pending' : 'paid'
      };

      // Save order to localStorage (in real app, send to backend)
      const orders = JSON.parse(localStorage.getItem('customerOrders') || '[]');
      const newOrder = {
        id: Date.now(),
        ...orderData,
        createdAt: new Date().toISOString(),
        orderNumber: `ORD-${Date.now()}`
      };
      orders.push(newOrder);
      localStorage.setItem('customerOrders', JSON.stringify(orders));

      console.log('Order placed:', newOrder);
      
      setPaymentStep('success');
      
      // Redirect to orders page after success
      setTimeout(() => {
        setShowCartModal(false);
        setPaymentStep('cart');
        setCart([]);
        setPhoneNumber('');
        navigate('/customer-dashboard/orders');
      }, 3000);

    } catch (error) {
      console.error('Checkout error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  const resetPaymentFlow = () => {
    setPaymentStep('cart');
    setPhoneNumber('');
    setIsProcessing(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price) => `$${Number(price).toFixed(2)}`;
  const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

  const getStockStatus = (stock, threshold) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (stock <= threshold) return { text: 'Low Stock', color: 'text-amber-600', bgColor: 'bg-amber-50' };
    return { text: 'In Stock', color: 'text-emerald-600', bgColor: 'bg-emerald-50' };
  };

  const getCategoryColor = (category) => {
    if (!category) return 'bg-gray-100 text-gray-600';
    
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-emerald-100 text-emerald-700',
      'bg-purple-100 text-purple-700',
      'bg-amber-100 text-amber-700',
      'bg-rose-100 text-rose-700',
      'bg-cyan-100 text-cyan-700',
      'bg-indigo-100 text-indigo-700',
      'bg-lime-100 text-lime-700'
    ];
    
    const index = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    const fallback = e.target.nextSibling;
    if (fallback) fallback.style.display = 'flex';
  };

  const renderPaymentStep = () => {
    switch (paymentStep) {
      case 'cart':
        return renderCartItems();
      case 'payment-method':
        return renderPaymentMethods();
      case 'mpesa':
        return renderMpesaPayment();
      case 'airtel':
        return renderAirtelPayment();
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
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <FiMinus className="text-sm" />
                    </button>
                    <span className="font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
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
                    onClick={() => removeFromCart(item.id)}
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
            onClick={() => setShowCartModal(false)}
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
          onClick={() => handlePaymentMethodSelect('airtel')}
          className="w-full flex items-center gap-4 p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
        >
          <div className="p-2 bg-red-500 text-white rounded-lg">
            <FiSmartphone className="text-xl" />
          </div>
          <div className="text-left flex-1">
            <div className="font-semibold text-red-900">Airtel Money</div>
            <div className="text-sm text-red-600">Pay with Airtel money</div>
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

        <button
          onClick={() => handleMobilePayment('M-Pesa')}
          disabled={isProcessing}
          className="w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 disabled:bg-green-300 transition-colors flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            'Pay with M-Pesa'
          )}
        </button>
      </div>
    </div>
  );

  const renderAirtelPayment = () => (
    <div className="p-6">
      <button
        onClick={() => setPaymentStep('payment-method')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
      >
        <FiArrowLeft className="text-sm" />
        Back to Payment Methods
      </button>

      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <FiSmartphone className="text-2xl text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Pay with Airtel Money</h3>
        <p className="text-gray-600 text-sm">Enter your Airtel Money phone number</p>
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
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-red-800">Total Amount:</span>
            <span className="font-semibold text-red-900">{formatPrice(getGrandTotal())}</span>
          </div>
          <p className="text-xs text-red-700">
            You will receive a prompt on your phone to complete the payment.
          </p>
        </div>

        <button
          onClick={() => handleMobilePayment('Airtel Money')}
          disabled={isProcessing}
          className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 disabled:bg-red-300 transition-colors flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            'Pay with Airtel Money'
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
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
      <p className="text-gray-600 mb-6">
        Your order has been placed successfully. Redirecting to your orders...
      </p>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Cart */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          
          {/* Cart Button */}
          <button
            onClick={() => setShowCartModal(true)}
            className="relative p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <FiShoppingCart className="text-xl text-gray-600" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <FiPackage className="text-gray-400 text-lg" />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FiFilter className="text-gray-400" />
              <span className="text-sm font-medium text-gray-600">Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  categoryFilter === 'all'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    categoryFilter === category
                      ? getCategoryColor(category) + ' shadow-sm'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock, product.threshold);
              const categoryColor = getCategoryColor(product.category);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  {/* Product Image and Basic Info */}
                  <div className="flex p-4">
                    {/* Image */}
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                      {product.image_url || product.image_filename ? (
                        <>
                          <img
                            src={product.image_url 
                              ? `http://localhost:5000${product.image_url}`
                              : `http://localhost:5000/uploads/${product.image_filename}`
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                          <div className="absolute inset-0 flex items-center justify-center hidden">
                            <FiImage className="text-gray-300" />
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FiImage className="text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {product.sku}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.bgColor} ${stockStatus.color}`}>
                          {stockStatus.text}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">
                          {formatPrice(product.price)}
                        </span>
                        {product.category && (
                          <span className={`text-xs px-2 py-1 rounded ${categoryColor}`}>
                            {product.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details Divider */}
                  <div className="border-t border-gray-100"></div>

                  {/* Compact Details */}
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <FiBox className="text-gray-400 flex-shrink-0" />
                        <div>
                          <div className="text-gray-500">Stock</div>
                          <div className="font-semibold text-gray-900">
                            {product.stock} {product.unit}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FiTrendingUp className="text-gray-400 flex-shrink-0" />
                        <div>
                          <div className="text-gray-500">Threshold</div>
                          <div className="font-semibold text-gray-900">{product.threshold}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FiCalendar className="text-gray-400 flex-shrink-0" />
                        <div>
                          <div className="text-gray-500">Expiry</div>
                          <div className="font-semibold text-gray-900">
                            {formatDate(product.expiry_date)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <FiDollarSign className="text-gray-400 flex-shrink-0" />
                        <div>
                          <div className="text-gray-500">Unit</div>
                          <div className="font-semibold text-gray-900">{product.unit}</div>
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                      className={`w-full mt-4 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                        product.stock === 0
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>

                    {/* Description if available */}
                    {product.description && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {product.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <FiPackage className="mx-auto text-gray-300 text-4xl mb-3" />
            <p className="text-gray-500 text-sm">
              {searchTerm || categoryFilter !== 'all'
                ? 'No products found. Try adjusting your search.'
                : 'No products available.'}
            </p>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
        )}

        {/* Cart Modal */}
        {showCartModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  {paymentStep === 'cart' && 'Shopping Cart'}
                  {paymentStep === 'payment-method' && 'Payment Method'}
                  {paymentStep === 'mpesa' && 'M-Pesa Payment'}
                  {paymentStep === 'airtel' && 'Airtel Money Payment'}
                  {paymentStep === 'success' && 'Payment Successful'}
                </h2>
                <button
                  onClick={() => {
                    setShowCartModal(false);
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
        )}
      </div>
    </div>
  );
};

export default Products;