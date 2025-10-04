// Products.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiPackage, FiImage, FiFilter, FiBox, FiDollarSign, FiCalendar, 
  FiTrendingUp, FiShoppingCart, FiX, FiPlus, FiMinus
} from 'react-icons/fi';
import CartModal from './CartModal';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);

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

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckoutSuccess = () => {
    setShowCartModal(false);
    setCart([]);
    navigate('/customer-dashboard/orders');
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
          <CartModal
            cart={cart}
            onClose={() => setShowCartModal(false)}
            onUpdateQuantity={updateQuantity}
            onRemoveFromCart={removeFromCart}
            onCheckoutSuccess={handleCheckoutSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default Products;