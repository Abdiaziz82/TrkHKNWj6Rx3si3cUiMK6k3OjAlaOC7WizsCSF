import React, { useState, useEffect } from 'react';
import { FiPackage, FiImage, FiFilter, FiBox, FiDollarSign, FiCalendar, FiTrendingUp } from 'react-icons/fi';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [categories, setCategories] = useState([]);

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
        {/* Search Bar - At the top */}
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

        {/* Products Grid - Compact Cards */}
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
      </div>
    </div>
  );
};

export default Products;