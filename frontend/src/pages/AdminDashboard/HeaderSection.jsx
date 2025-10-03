import React from 'react';
import { FiPlus, FiUpload, FiDownload } from 'react-icons/fi';

const HeaderSection = ({ 
  globalFilter, 
  setGlobalFilter, 
  isLoading, 
  handleBulkUpload, 
  downloadTemplate, 
  openAddModal 
}) => {
  return (
    <>
      {/* Header */}
      <div className="mb-4 font">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600">Manage your products, stock levels, and inventory</p>
      </div>

      {/* Bulk Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 font">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bulk Operations</h3>
            <p className="text-sm text-gray-600">Upload multiple products at once using CSV template</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
              <FiUpload className="mr-2" size={16} />
              Bulk Upload CSV
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleBulkUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={downloadTemplate}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiDownload className="mr-2" size={16} />
              Download Template
            </button>
          </div>
        </div>
      </div>

      {/* Action Bar with Search and Add Product */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 font">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products by name, SKU, description..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Add Product Button */}
          <div className="flex gap-2">
            <button
              onClick={openAddModal}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              disabled={isLoading}
            >
              <FiPlus className="mr-2" size={16} />
              Add Product
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderSection;