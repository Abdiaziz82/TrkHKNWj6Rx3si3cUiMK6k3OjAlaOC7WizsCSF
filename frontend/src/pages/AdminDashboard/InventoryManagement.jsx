import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { FiEdit, FiTrash2, FiPlus, FiUpload, FiDownload, FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';

const InventoryManagement = () => {
  const [data, setData] = useState([
    // Sample data
    {
      id: '1',
      name: 'Sugar 50kg',
      sku: 'SUG50',
      description: 'Premium quality sugar',
      unit: 'kg',
      price: 45.99,
      stock: 150,
      threshold: 20,
      expiry_date: '2024-12-31',
      status: 'active'
    },
    {
      id: '2',
      name: 'Rice 25kg',
      sku: 'RIC25',
      description: 'Basmati rice',
      unit: 'kg',
      price: 89.99,
      stock: 15,
      threshold: 25,
      expiry_date: '2024-10-15',
      status: 'low_stock'
    },
    {
      id: '3',
      name: 'Flour 10kg',
      sku: 'FLR10',
      description: 'All-purpose flour',
      unit: 'kg',
      price: 25.50,
      stock: 0,
      threshold: 10,
      expiry_date: '2024-08-20',
      status: 'out_of_stock'
    }
  ]);

  const [globalFilter, setGlobalFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    sku: '',
    description: '',
    unit: 'kg',
    price: 0,
    stock: 0,
    threshold: 0,
    expiry_date: '',
    status: 'active'
  });

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active', color: 'green', icon: FiCheckCircle },
    { value: 'inactive', label: 'Inactive', color: 'gray', icon: FiXCircle },
    { value: 'low_stock', label: 'Low Stock', color: 'orange', icon: FiAlertCircle },
    { value: 'out_of_stock', label: 'Out of Stock', color: 'red', icon: FiXCircle },
    { value: 'discontinued', label: 'Discontinued', color: 'gray', icon: FiXCircle }
  ];

  // Column definitions
  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Product Name',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'sku',
      header: 'SKU',
      cell: info => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: info => info.getValue() || '-',
    },
    {
      accessorKey: 'unit',
      header: 'Unit',
      cell: info => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = info.getValue();
        const statusConfig = statusOptions.find(s => s.value === status);
        const Icon = statusConfig?.icon || FiAlertCircle;
        const colorClass = {
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-gray-100 text-gray-800',
          low_stock: 'bg-orange-100 text-orange-800',
          out_of_stock: 'bg-red-100 text-red-800',
          discontinued: 'bg-gray-100 text-gray-800'
        }[status] || 'bg-gray-100 text-gray-800';

        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
            <Icon className="w-3 h-3 mr-1" />
            {statusConfig?.label || status}
          </span>
        );
      },
    },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: info => `$${Number(info.getValue()).toFixed(2)}`,
    },
    {
      accessorKey: 'stock',
      header: 'Stock',
      cell: info => {
        const stock = Number(info.getValue());
        const threshold = info.row.original.threshold;
        const isLowStock = stock <= threshold;
        const isOutOfStock = stock === 0;
        
        let stockClass = 'text-green-600';
        if (isOutOfStock) stockClass = 'text-red-600 font-bold';
        else if (isLowStock) stockClass = 'text-orange-600 font-semibold';

        return (
          <span className={stockClass}>
            {stock} {isLowStock && '⚠️'}
          </span>
        );
      },
    },
    {
      accessorKey: 'threshold',
      header: 'Threshold',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'expiry_date',
      header: 'Expiry Date',
      cell: info => {
        const date = new Date(info.getValue());
        const today = new Date();
        const daysUntilExpiry = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const isExpiringSoon = daysUntilExpiry <= 30;
        const isExpired = daysUntilExpiry < 0;
        
        let dateClass = '';
        if (isExpired) dateClass = 'text-red-600 font-bold';
        else if (isExpiringSoon) dateClass = 'text-orange-600 font-medium';

        return (
          <span className={dateClass}>
            {date.toLocaleDateString()}
            {isExpiringSoon && ' ⚠️'}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ], []);

  // TanStack Table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // CRUD Operations
  const handleAdd = () => {
    const itemWithId = {
      ...newItem,
      id: Date.now().toString()
    };
    setData(prev => [...prev, itemWithId]);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem(item);
    setIsAddModalOpen(true);
  };

  const handleUpdate = () => {
    setData(prev => prev.map(item => 
      item.id === editingItem.id ? { ...newItem, id: editingItem.id } : item
    ));
    setEditingItem(null);
    resetForm();
    setIsAddModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setData(prev => prev.filter(item => item.id !== id));
    }
  };

  const resetForm = () => {
    setNewItem({
      name: '',
      sku: '',
      description: '',
      unit: 'kg',
      price: 0,
      stock: 0,
      threshold: 0,
      expiry_date: '',
      status: 'active'
    });
  };

  const handleBulkUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('Processing bulk upload:', file.name);
      // Add your file processing logic here
      alert(`Processing bulk upload: ${file.name}`);
    }
  };

  const downloadTemplate = () => {
    const headers = ['name', 'sku', 'description', 'unit', 'price', 'stock', 'threshold', 'expiry_date', 'status'];
    const sampleData = ['Sugar 50kg', 'SUG50', 'Premium quality sugar', 'kg', '45.99', '150', '20', '2024-12-31', 'active'];
    const csvContent = [headers.join(','), sampleData.join(',')].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'inventory_template.csv';
    link.click();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
        <p className="text-gray-600">Manage your products, stock levels, and inventory</p>
      </div>

      {/* Bulk Upload Section - Above Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
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
              onClick={() => {
                setEditingItem(null);
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2" size={16} />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th 
                      key={header.id} 
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {table.getRowModel().rows.length === 0 && (
          <div className="text-center py-12">
            <FiPackage className="mx-auto text-gray-400" size={48} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
            <p className="mt-2 text-gray-500">Get started by adding your first product or using bulk upload.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
          <div className="text-sm text-gray-700">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Edit Product' : 'Add New Product'}
              </h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Sugar 50kg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU *
                  </label>
                  <input
                    type="text"
                    value={newItem.sku}
                    onChange={(e) => setNewItem(prev => ({ ...prev, sku: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Unique stock code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Optional product description"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="kg">kg</option>
                      <option value="pcs">pcs</option>
                      <option value="carton">carton</option>
                      <option value="box">box</option>
                      <option value="pack">pack</option>
                      <option value="litre">litre</option>
                      <option value="meter">meter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={newItem.status}
                      onChange={(e) => setNewItem(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newItem.price}
                      onChange={(e) => setNewItem(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newItem.stock}
                      onChange={(e) => setNewItem(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Threshold
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newItem.threshold}
                      onChange={(e) => setNewItem(prev => ({ ...prev, threshold: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={newItem.expiry_date}
                      onChange={(e) => setNewItem(prev => ({ ...prev, expiry_date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingItem ? handleUpdate : handleAdd}
                disabled={!newItem.name || !newItem.sku}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingItem ? 'Update' : 'Add'} Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;