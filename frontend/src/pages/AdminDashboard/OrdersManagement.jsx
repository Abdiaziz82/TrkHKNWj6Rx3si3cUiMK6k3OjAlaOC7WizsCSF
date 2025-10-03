import React, { useState, useEffect } from 'react';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Mock data - replace with your actual API call
const mockOrders = [
  {
    id: '1',
    customerName: 'John Smith',
    customerPhone: '+1 (555) 123-4567',
    product: 'Premium Widget A',
    qty: 5,
    unitPrice: 29.99,
    total: 149.95,
    method: 'Credit Card',
    status: 'completed',
    date: '2024-01-15',
  },
  {
    id: '2',
    customerName: 'Sarah Johnson',
    customerPhone: '+1 (555) 987-6543',
    product: 'Standard Widget B',
    qty: 10,
    unitPrice: 15.50,
    total: 155.00,
    method: 'Bank Transfer',
    status: 'pending',
    date: '2024-01-16',
  },
  {
    id: '3',
    customerName: 'Michael Brown',
    customerPhone: '+1 (555) 456-7890',
    product: 'Deluxe Widget C',
    qty: 2,
    unitPrice: 79.99,
    total: 159.98,
    method: 'Cash',
    status: 'shipped',
    date: '2024-01-14',
  },
  {
    id: '4',
    customerName: 'Emily Davis',
    customerPhone: '+1 (555) 234-5678',
    product: 'Basic Widget D',
    qty: 20,
    unitPrice: 9.99,
    total: 199.80,
    method: 'Credit Card',
    status: 'cancelled',
    date: '2024-01-13',
  },
  {
    id: '5',
    customerName: 'David Wilson',
    customerPhone: '+1 (555) 876-5432',
    product: 'Premium Widget A',
    qty: 8,
    unitPrice: 29.99,
    total: 239.92,
    method: 'Bank Transfer',
    status: 'completed',
    date: '2024-01-12',
  },
];

const columnHelper = createColumnHelper();

const OrdersManagement = () => {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Fetch data - replace with your actual API call
  useEffect(() => {
    // Simulate API call
    setData(mockOrders);
  }, []);

  // Initialize edit form when editing starts
  useEffect(() => {
    if (editingOrder) {
      setEditForm({ ...editingOrder });
    }
  }, [editingOrder]);

  const handleEditChange = (field, value) => {
    setEditForm(prev => {
      const updatedForm = { ...prev, [field]: value };
      
      // Recalculate total if quantity or unit price changes
      if (field === 'qty' || field === 'unitPrice') {
        const qty = field === 'qty' ? parseInt(value) || 0 : parseInt(prev.qty) || 0;
        const unitPrice = field === 'unitPrice' ? parseFloat(value) || 0 : parseFloat(prev.unitPrice) || 0;
        updatedForm.total = (qty * unitPrice).toFixed(2);
      }
      
      return updatedForm;
    });
  };

  const handleSaveEdit = () => {
    if (editingOrder) {
      setData(prevData =>
        prevData.map(item =>
          item.id === editingOrder.id ? { ...editForm } : item
        )
      );
      
      // Show success message
      showMessage('Order updated successfully!', 'green');
      setEditingOrder(null);
      setEditForm({});
    }
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setEditForm({});
  };

  const showMessage = (message, color = 'blue') => {
    const messageDiv = document.createElement('div');
    messageDiv.className = `fixed top-4 right-4 bg-${color}-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
      messageDiv.remove();
    }, 3000);
  };

  const columns = [
    columnHelper.accessor('customerName', {
      header: 'Customer Name',
      cell: (info) => {
        const order = info.row.original;
        const isEditing = editingOrder?.id === order.id;
        
        if (isEditing) {
          return (
            <input
              type="text"
              value={editForm.customerName || ''}
              onChange={(e) => handleEditChange('customerName', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Customer Name"
            />
          );
        }
        
        return (
          <div className="font-medium text-gray-900">
            {info.getValue()}
          </div>
        );
      },
    }),
    columnHelper.accessor('customerPhone', {
      header: 'Phone',
      cell: (info) => {
        const order = info.row.original;
        const isEditing = editingOrder?.id === order.id;
        
        if (isEditing) {
          return (
            <input
              type="tel"
              value={editForm.customerPhone || ''}
              onChange={(e) => handleEditChange('customerPhone', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Phone Number"
            />
          );
        }
        
        return (
          <div className="text-gray-600">
            {info.getValue()}
          </div>
        );
      },
    }),
    columnHelper.accessor('product', {
      header: 'Product',
      cell: (info) => {
        const order = info.row.original;
        const isEditing = editingOrder?.id === order.id;
        
        if (isEditing) {
          return (
            <select
              value={editForm.product || ''}
              onChange={(e) => handleEditChange('product', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Product</option>
              <option value="Premium Widget A">Premium Widget A</option>
              <option value="Standard Widget B">Standard Widget B</option>
              <option value="Deluxe Widget C">Deluxe Widget C</option>
              <option value="Basic Widget D">Basic Widget D</option>
              <option value="Enterprise Widget E">Enterprise Widget E</option>
            </select>
          );
        }
        
        return info.getValue();
      },
    }),
    columnHelper.accessor('qty', {
      header: 'Qty',
      cell: (info) => {
        const order = info.row.original;
        const isEditing = editingOrder?.id === order.id;
        
        if (isEditing) {
          return (
            <input
              type="number"
              min="1"
              value={editForm.qty || ''}
              onChange={(e) => handleEditChange('qty', e.target.value)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          );
        }
        
        return (
          <div className="text-center">
            {info.getValue()}
          </div>
        );
      },
    }),
    columnHelper.accessor('unitPrice', {
      header: 'Unit Price',
      cell: (info) => {
        const order = info.row.original;
        const isEditing = editingOrder?.id === order.id;
        
        if (isEditing) {
          return (
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editForm.unitPrice || ''}
                onChange={(e) => handleEditChange('unitPrice', e.target.value)}
                className="w-24 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          );
        }
        
        return `$${info.getValue().toFixed(2)}`;
      },
    }),
    columnHelper.accessor('total', {
      header: 'Total',
      cell: (info) => {
        const order = info.row.original;
        const isEditing = editingOrder?.id === order.id;
        
        if (isEditing) {
          return (
            <div className="font-semibold text-gray-900">
              ${editForm.total || '0.00'}
            </div>
          );
        }
        
        return (
          <div className="font-semibold text-gray-900">
            ${info.getValue().toFixed(2)}
          </div>
        );
      },
    }),
    columnHelper.accessor('method', {
      header: 'Payment Method',
      cell: (info) => {
        const order = info.row.original;
        const isEditing = editingOrder?.id === order.id;
        
        if (isEditing) {
          return (
            <select
              value={editForm.method || ''}
              onChange={(e) => handleEditChange('method', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="PayPal">PayPal</option>
              <option value="Digital Wallet">Digital Wallet</option>
            </select>
          );
        }
        
        return (
          <div className="text-gray-600">
            {info.getValue()}
          </div>
        );
      },
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const order = info.row.original;
        const isEditing = editingOrder?.id === order.id;
        const status = isEditing ? editForm.status : info.getValue();
        
        const statusColors = {
          pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
          completed: 'bg-green-100 text-green-800 border border-green-200',
          cancelled: 'bg-red-100 text-red-800 border border-red-200',
          shipped: 'bg-blue-100 text-blue-800 border border-blue-200',
        };
        
        if (isEditing) {
          return (
            <select
              value={status || ''}
              onChange={(e) => handleEditChange('status', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="shipped">Shipped</option>
              <option value="cancelled">Cancelled</option>
            </select>
          );
        }
        
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    }),
    columnHelper.accessor('date', {
      header: 'Date',
      cell: (info) => {
        const order = info.row.original;
        const isEditing = editingOrder?.id === order.id;
        
        if (isEditing) {
          return (
            <input
              type="date"
              value={editForm.date || ''}
              onChange={(e) => handleEditChange('date', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          );
        }
        
        return (
          <div className="text-gray-600">
            {new Date(info.getValue()).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const order = row.original;
        const isEditing = editingOrder?.id === order.id;
        
        if (isEditing) {
          return (
            <div className="flex space-x-2 justify-center">
              <button
                onClick={handleSaveEdit}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
                title="Save Changes"
              >
                <CheckIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Cancel Edit"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          );
        }
        
        return (
          <div className="flex space-x-2 justify-center">
            <button
              onClick={() => handlePrintReceipt(order)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Print Receipt"
            >
              <PrinterIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleViewOrder(order)}
              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
              title="View Order Details"
            >
              <EyeIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleEditOrder(order)}
              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors duration-200"
              title="Edit Order"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDeleteOrder(order)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Delete Order"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        );
      },
    }),
  ];

  // Filter data based on status
  const filteredData = React.useMemo(() => {
    if (!statusFilter) return data;
    return data.filter(order => order.status === statusFilter);
  }, [data, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Action handlers
  const handlePrintReceipt = (order) => {
    console.log('Print receipt for order:', order);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - Order #${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .receipt { border: 1px solid #000; padding: 20px; max-width: 400px; }
            .header { text-align: center; margin-bottom: 20px; }
            .section { margin: 10px 0; }
            .total { font-weight: bold; font-size: 1.2em; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h2>ORDER RECEIPT</h2>
              <p>Order #${order.id}</p>
            </div>
            <div class="section">
              <p><strong>Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
              <p><strong>Customer:</strong> ${order.customerName}</p>
              <p><strong>Phone:</strong> ${order.customerPhone}</p>
            </div>
            <div class="section">
              <p><strong>Product:</strong> ${order.product}</p>
              <p><strong>Quantity:</strong> ${order.qty}</p>
              <p><strong>Unit Price:</strong> $${order.unitPrice.toFixed(2)}</p>
              <p class="total">Total: $${order.total.toFixed(2)}</p>
            </div>
            <div class="section">
              <p><strong>Payment Method:</strong> ${order.method}</p>
              <p><strong>Status:</strong> ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleViewOrder = (order) => {
    console.log('View order:', order);
    
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold text-gray-900">Order Details - #${order.id}</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-semibold text-gray-700 mb-2">Customer Information</h4>
            <div class="space-y-2">
              <p><strong>Name:</strong> ${order.customerName}</p>
              <p><strong>Phone:</strong> ${order.customerPhone}</p>
              <p><strong>Order Date:</strong> ${new Date(order.date).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div>
            <h4 class="font-semibold text-gray-700 mb-2">Order Information</h4>
            <div class="space-y-2">
              <p><strong>Status:</strong> 
                <span class="ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                  order.status === 'completed' ? 'bg-green-100 text-green-800' :
                  order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }">
                  ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </p>
              <p><strong>Payment Method:</strong> ${order.method}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-6">
          <h4 class="font-semibold text-gray-700 mb-2">Product Details</h4>
          <div class="border rounded-lg p-4">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium">${order.product}</p>
                <p class="text-sm text-gray-600">Quantity: ${order.qty}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-gray-600">Unit Price: $${order.unitPrice.toFixed(2)}</p>
                <p class="font-semibold">Total: $${order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mt-6 flex justify-end space-x-3">
          <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 text-gray-600 hover:text-gray-800">
            Close
          </button>
          <button onclick="handlePrintReceiptFromModal(${JSON.stringify(order).replace(/"/g, '&quot;')})" 
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Print Receipt
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    window.handlePrintReceiptFromModal = (orderData) => {
      modal.remove();
      handlePrintReceipt(orderData);
    };
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
  };

  const handleDeleteOrder = (order) => {
    console.log('Delete order:', order);
    
    if (confirm(`Are you sure you want to delete order #${order.id} for ${order.customerName}? This action cannot be undone.`)) {
      setData(prevData => prevData.filter(item => item.id !== order.id));
      showMessage(`Order #${order.id} has been deleted.`, 'red');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Customer Name', 'Phone', 'Product', 'Quantity', 'Unit Price', 'Total', 'Payment Method', 'Status', 'Date'];
    const csvData = filteredData.map(order => [
      order.id,
      order.customerName,
      order.customerPhone,
      order.product,
      order.qty,
      order.unitPrice,
      order.total,
      order.method,
      order.status,
      order.date
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showMessage(`Exported ${filteredData.length} orders to CSV file.`, 'green');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">
            Manage and track all customer orders from one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <DocumentTextIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{data.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <EyeIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.filter(order => order.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <PencilIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.filter(order => order.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <TrashIcon className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.filter(order => order.status === 'cancelled').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow">
          {/* Search and Controls */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search orders by customer, product, or phone..."
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex space-x-3">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="shipped">Shipped</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                <button 
                  onClick={handleExportCSV}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <PrinterIcon className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center space-x-1">
                          <span>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </span>
                          {header.column.getIsSorted() && (
                            <span>
                              {header.column.getIsSorted() === 'desc' ? (
                                <ChevronDownIcon className="w-4 h-4" />
                              ) : (
                                <ChevronUpIcon className="w-4 h-4" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr 
                    key={row.id} 
                    className={`hover:bg-gray-50 transition-colors ${
                      editingOrder?.id === row.original.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(
                      (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                      filteredData.length
                    )}
                  </span>{' '}
                  of <span className="font-medium">{filteredData.length}</span> results
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-700">
                  Page{' '}
                  <span className="font-medium">
                    {table.getState().pagination.pageIndex + 1}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">
                    {table.getPageCount()}
                  </span>
                </span>
                
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersManagement;