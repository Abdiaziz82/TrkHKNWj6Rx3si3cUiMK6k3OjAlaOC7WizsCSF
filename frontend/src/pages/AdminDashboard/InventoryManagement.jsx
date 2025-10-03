import React, { useState, useMemo, useEffect } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { FiEdit, FiTrash2, FiPlus, FiUpload, FiDownload, FiCheckCircle, FiXCircle, FiAlertCircle, FiPackage } from 'react-icons/fi';

// Import exactly 3 components
import HeaderSection from './HeaderSection';
import ProductTable from './ProductTable';
import AddEditModal from './AddEditModal';

const InventoryManagement = () => {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  // API base URL
  const API_BASE_URL = 'http://localhost:5000/api/products';

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // API Functions
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
        setData(result.products);
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

  const createProduct = async (productData) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`Failed to create product: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`Failed to update product: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Active', color: 'green', icon: FiCheckCircle },
    { value: 'inactive', label: 'Inactive', color: 'gray', icon: FiXCircle },
    { value: 'low_stock', label: 'Low Stock', color: 'orange', icon: FiAlertCircle },
    { value: 'out_of_stock', label: 'Out of Stock', color: 'red', icon: FiXCircle },
    { value: 'discontinued', label: 'Discontinued', color: 'gray', icon: FiXCircle }
  ];

  // CRUD Operations
  const handleAdd = async () => {
    if (!newItem.name || !newItem.sku) {
      alert('Product name and SKU are required');
      return;
    }

    try {
      setIsLoading(true);
      const result = await createProduct(newItem);
      
      if (result.success) {
        await fetchProducts();
        resetForm();
        setIsAddModalOpen(false);
        alert('Product added successfully!');
      } else {
        throw new Error(result.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setNewItem({
      ...item,
      price: parseFloat(item.price),
      stock: parseInt(item.stock),
      threshold: parseInt(item.threshold),
      expiry_date: item.expiry_date ? item.expiry_date.split('T')[0] : '',
    });
    setIsAddModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!newItem.name || !newItem.sku) {
      alert('Product name and SKU are required');
      return;
    }

    try {
      setIsLoading(true);
      const result = await updateProduct(editingItem.id, newItem);
      
      if (result.success) {
        await fetchProducts();
        setEditingItem(null);
        resetForm();
        setIsAddModalOpen(false);
        alert('Product updated successfully!');
      } else {
        throw new Error(result.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setIsLoading(true);
      const result = await deleteProduct(id);
      
      if (result.success) {
        await fetchProducts();
        alert('Product deleted successfully!');
      } else {
        throw new Error(result.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product: ' + error.message);
    } finally {
      setIsLoading(false);
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

  // Column definitions with index column
  const columns = useMemo(() => [
    {
      id: 'index',
      header: '#',
      cell: ({ row }) => (
        <span className="text-sm text-gray-500 font-medium">
          {row.index + 1}
        </span>
      ),
      size: 60,
    },
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
        const dateValue = info.getValue();
        if (!dateValue) return '-';
        
        const date = new Date(dateValue);
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

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <HeaderSection
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        isLoading={isLoading}
        handleBulkUpload={handleBulkUpload}
        downloadTemplate={downloadTemplate}
        openAddModal={() => {
          setEditingItem(null);
          resetForm();
          setIsAddModalOpen(true);
        }}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
>>>>>>> 53996047f7b121d79156baef6f4b995e762c8667
        </div>
      )}

      {/* Table */}
      {!isLoading && (
        <ProductTable 
          table={table}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <AddEditModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        editingItem={editingItem}
        newItem={newItem}
        setNewItem={setNewItem}
        onSave={editingItem ? handleUpdate : handleAdd}
        isLoading={isLoading}
        statusOptions={statusOptions}
      />
    </div>
  );
};

export default InventoryManagement