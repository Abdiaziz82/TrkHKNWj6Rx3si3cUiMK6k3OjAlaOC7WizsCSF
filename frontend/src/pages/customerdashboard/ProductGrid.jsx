// import React from 'react';
// import { FiFilter, FiImage, FiBox, FiDollarSign, FiCalendar, FiTrendingUp ,Fipackage} from 'react-icons/fi';

// const ProductGrid = ({
//   products,
//   allProducts,
//   isLoading,
//   categories,
//   categoryFilter,
//   setCategoryFilter,
//   getCategoryColor,
//   addToCart
// }) => {
//   // Utility functions
//   const formatPrice = (price) => `$${Number(price).toFixed(2)}`;
//   const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : 'N/A';

//   const getStockStatus = (stock, threshold) => {
//     if (stock === 0) return { text: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-50' };
//     if (stock <= threshold) return { text: 'Low Stock', color: 'text-amber-600', bgColor: 'bg-amber-50' };
//     return { text: 'In Stock', color: 'text-emerald-600', bgColor: 'bg-emerald-50' };
//   };

//   const handleImageError = (e) => {
//     e.target.style.display = 'none';
//     const fallback = e.target.nextSibling;
//     if (fallback) fallback.style.display = 'flex';
//   };

//   // Loading State
//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Category Filter */}
//       {categories.length > 0 && (
//         <div className="mb-6">
//           <div className="flex items-center gap-2 mb-3">
//             <FiFilter className="text-gray-400" />
//             <span className="text-sm font-medium text-gray-600">Categories</span>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={() => setCategoryFilter('all')}
//               className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
//                 categoryFilter === 'all'
//                   ? 'bg-blue-500 text-white shadow-sm'
//                   : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
//               }`}
//             >
//               All
//             </button>
//             {categories.map((category) => (
//               <button
//                 key={category}
//                 onClick={() => setCategoryFilter(category)}
//                 className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
//                   categoryFilter === category
//                     ? getCategoryColor(category) + ' shadow-sm'
//                     : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
//                 }`}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Products Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {products.map((product) => {
//           const stockStatus = getStockStatus(product.stock, product.threshold);
//           const categoryColor = getCategoryColor(product.category);

//           return (
//             <div
//               key={product.id}
//               className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
//             >
//               {/* Product Image and Basic Info */}
//               <div className="flex p-4">
//                 {/* Image */}
//                 <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mr-4">
//                   {product.image_url || product.image_filename ? (
//                     <>
//                       <img
//                         src={product.image_url 
//                           ? `http://localhost:5000${product.image_url}`
//                           : `http://localhost:5000/uploads/${product.image_filename}`
//                         }
//                         alt={product.name}
//                         className="w-full h-full object-cover"
//                         onError={handleImageError}
//                       />
//                       <div className="absolute inset-0 flex items-center justify-center hidden">
//                         <FiImage className="text-gray-300" />
//                       </div>
//                     </>
//                   ) : (
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <FiImage className="text-gray-300" />
//                     </div>
//                   )}
//                 </div>

//                 {/* Basic Info */}
//                 <div className="flex-1 min-w-0">
//                   <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">
//                     {product.name}
//                   </h3>
//                   <div className="flex items-center gap-2 mb-2">
//                     <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
//                       {product.sku}
//                     </span>
//                     <span className={`text-xs px-2 py-1 rounded-full ${stockStatus.bgColor} ${stockStatus.color}`}>
//                       {stockStatus.text}
//                     </span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-lg font-bold text-blue-600">
//                       {formatPrice(product.price)}
//                     </span>
//                     {product.category && (
//                       <span className={`text-xs px-2 py-1 rounded ${categoryColor}`}>
//                         {product.category}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Details Divider */}
//               <div className="border-t border-gray-100"></div>

//               {/* Compact Details */}
//               <div className="p-4">
//                 <div className="grid grid-cols-2 gap-3 text-xs">
//                   <div className="flex items-center gap-2">
//                     <FiBox className="text-gray-400 flex-shrink-0" />
//                     <div>
//                       <div className="text-gray-500">Stock</div>
//                       <div className="font-semibold text-gray-900">
//                         {product.stock} {product.unit}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     <FiTrendingUp className="text-gray-400 flex-shrink-0" />
//                     <div>
//                       <div className="text-gray-500">Threshold</div>
//                       <div className="font-semibold text-gray-900">{product.threshold}</div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     <FiCalendar className="text-gray-400 flex-shrink-0" />
//                     <div>
//                       <div className="text-gray-500">Expiry</div>
//                       <div className="font-semibold text-gray-900">
//                         {formatDate(product.expiry_date)}
//                       </div>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center gap-2">
//                     <FiDollarSign className="text-gray-400 flex-shrink-0" />
//                     <div>
//                       <div className="text-gray-500">Unit</div>
//                       <div className="font-semibold text-gray-900">{product.unit}</div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Add to Cart Button */}
//                 <button
//                   onClick={() => addToCart(product)}
//                   disabled={product.stock === 0}
//                   className={`w-full mt-4 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
//                     product.stock === 0
//                       ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
//                       : 'bg-blue-500 text-white hover:bg-blue-600'
//                   }`}
//                 >
//                   {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
//                 </button>

//                 {/* Description if available */}
//                 {product.description && (
//                   <div className="mt-3 pt-3 border-t border-gray-100">
//                     <p className="text-xs text-gray-600 line-clamp-2">
//                       {product.description}
//                     </p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Empty State */}
//       {products.length === 0 && (
//         <div className="text-center py-12">
//           <FiPackage className="mx-auto text-gray-300 text-4xl mb-3" />
//           <p className="text-gray-500 text-sm">
//             No products available.
//           </p>
//         </div>
//       )}

//       {/* Results Count */}
//       {products.length > 0 && (
//         <div className="mt-6 text-center">
//           <p className="text-gray-500 text-sm">
//             Showing {products.length} of {allProducts.length} products
//           </p>
//         </div>
//       )}
//     </>
//   );
// };

// export default ProductGrid;