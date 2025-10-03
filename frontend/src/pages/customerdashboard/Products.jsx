import React, { useState, useEffect } from 'react';
import { FiPackage, FiImage, FiAlertCircle, FiCheckCircle, FiXCircle, FiShoppingCart } from 'react-icons/fi';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, active, low_stock, out_of_stock
  const [searchTerm, setSearchTerm] = useState('');

  // API base URL - same as your inventory management
  const API_BASE_URL = 'http://localhost:5000/api/products';

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // API Function to fetch products
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

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setProducts(result.products);
      } else {
        throw new Error(result.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error fetching products: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Status configuration
  const statusConfig = {
    active: { label: 'In Stock', color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
    low_stock: { label: 'Low Stock', color: 'bg-orange-100 text-orange-800', icon: FiAlertCircle },
    out_of_stock: { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: FiXCircle },
    discontinued: { label: 'Discontinued', color: 'bg-gray-100 text-gray-800', icon: FiXCircle }
  };

  // Determine product status based on stock and threshold
  const getProductStatus = (product) => {
    const stock = Number(product.stock);
    const threshold = Number(product.threshold);
    
    if (stock === 0) return 'out_of_stock';
    if (stock <= threshold) return 'low_stock';
    return 'active';
  };

  // Filter products based on status filter and search term
  const filteredProducts = products.filter(product => {
    const status = getProductStatus(product);
    const matchesFilter = filter === 'all' || status === filter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Format price
  const formatPrice = (price) => {
    return `$${Number(price).toFixed(2)}`;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Check if product is expiring soon (within 30 days)
  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  // Check if product is expired
  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  // Get stock status text color
  const getStockColor = (stock, threshold) => {
    if (stock === 0) return 'text-red-600';
    if (stock <= threshold) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FiShoppingCart className="text-blue-600" />
            Product Catalog
          </h1>
          <p className="text-gray-600 mt-2">Browse our complete product inventory</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full md:max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products by name, SKU, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPackage className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Products
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                In Stock
              </button>
              <button
                onClick={() => setFilter('low_stock')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'low_stock'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Low Stock
              </button>
              <button
                onClick={() => setFilter('out_of_stock')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'out_of_stock'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Out of Stock
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const status = getProductStatus(product);
              const statusInfo = statusConfig[status];
              const StatusIcon = statusInfo.icon;
              const stockColor = getStockColor(product.stock, product.threshold);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {product.image_filename ? (
                      <img
                        src={`http://localhost:5000/uploads/${product.image_filename}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`absolute inset-0 flex items-center justify-center ${product.image_filename ? 'hidden' : 'flex'}`}>
                      <FiImage className="text-gray-400 text-4xl" />
                    </div>
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </span>
                    </div>

                    {/* Expiry Warning */}
                    {isExpired(product.expiry_date) && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <FiAlertCircle className="w-3 h-3 mr-1" />
                          Expired
                        </span>
                      </div>
                    )}
                    {isExpiringSoon(product.expiry_date) && !isExpired(product.expiry_date) && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          <FiAlertCircle className="w-3 h-3 mr-1" />
                          Expiring Soon
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    {/* Product Name and SKU */}
                    <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.sku}
                      </span>
                      <span className="text-lg font-bold text-blue-600">
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    {/* Description */}
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Product Details Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Unit:</span>
                        <span className="ml-1 font-medium text-gray-700">{product.unit}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Stock:</span>
                        <span className={`ml-1 font-medium ${stockColor}`}>
                          {product.stock} {status === 'low_stock' && '⚠️'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Threshold:</span>
                        <span className="ml-1 font-medium text-gray-700">{product.threshold}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Expiry:</span>
                        <span className={`ml-1 font-medium ${
                          isExpired(product.expiry_date) 
                            ? 'text-red-600' 
                            : isExpiringSoon(product.expiry_date) 
                            ? 'text-orange-600' 
                            : 'text-gray-700'
                        }`}>
                          {formatDate(product.expiry_date)}
                        </span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="border-t border-gray-100 pt-3">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Last Updated:</span>
                        <span>{formatDate(product.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProducts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FiPackage className="mx-auto text-gray-400 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'No products available in the inventory.'}
            </p>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && filteredProducts.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm">
              Showing {filteredProducts.length} of {products.length} products
              {searchTerm && ` matching "${searchTerm}"`}
              {filter !== 'all' && ` (${filter.replace('_', ' ')})`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;