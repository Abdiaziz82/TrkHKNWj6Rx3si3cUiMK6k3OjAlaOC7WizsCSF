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
  TruckIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

const columnHelper = createColumnHelper();

const OrdersManagement = () => {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        setData(result.orders || []);
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showMessage('Failed to fetch orders', 'red');
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const result = await response.json();
        // Update local state
        setData(prevData =>
          prevData.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        showMessage(`Order marked as ${newStatus}`, 'green');
        return true;
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showMessage('Failed to update order status', 'red');
      return false;
    }
  };

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
      if (field === 'quantity' || field === 'price') {
        const qty = field === 'quantity' ? parseInt(value) || 0 : parseInt(prev.quantity) || 0;
        const price = field === 'price' ? parseFloat(value) || 0 : parseFloat(prev.price) || 0;
        updatedForm.total_amount = (qty * price).toFixed(2);
      }
      
      return updatedForm;
    });
  };

  const handleSaveEdit = async () => {
    if (editingOrder) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/orders/${editingOrder.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(editForm),
        });

        if (response.ok) {
          const result = await response.json();
          setData(prevData =>
            prevData.map(item =>
              item.id === editingOrder.id ? { ...editForm } : item
            )
          );
          showMessage('Order updated successfully!', 'green');
          setEditingOrder(null);
          setEditForm({});
        } else {
          throw new Error('Failed to update order');
        }
      } catch (error) {
        console.error('Error updating order:', error);
        showMessage('Failed to update order', 'red');
      }
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
    columnHelper.accessor('id', {
      header: 'Order ID',
      cell: (info) => {
        const order = info.row.original;
        return (
          <div className="font-medium text-gray-900">
            #{info.getValue()}
          </div>
        );
      },
    }),
    columnHelper.accessor('customer_name', {
      header: 'Customer Name',
      cell: (info) => {
        const order = info.row.original;
        const isEditing = editingOrder?.id === order.id;
        
        if (isEditing) {
          return (
            <input
              type="text"
              value={editForm.customer_name || ''}
              onChange={(e) => handleEditChange('customer_name', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Customer Name"
            />
          );
        }
        
        return (
          <div className="font-medium text-gray-900">
            {info.getValue() || 'Unknown Customer'}
          </div>
        );
      },
    }),
    columnHelper.accessor('customer_phone', {
      header: 'Phone',
      cell: (info) => {
        const order = info.row.original;
        const isEditing = editingOrder?.id === order.id;
        
        if (isEditing) {
          return (
            <input
              type="tel"
              value={editForm.customer_phone || ''}
              onChange={(e) => handleEditChange('customer_phone', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Phone Number"
            />
          );
        }
        
        const phone = info.getValue() || order.mpesa_phone_number || 'N/A';
        return (
          <div className="text-gray-600">
            {phone}
          </div>
        );
      },
    }),
    columnHelper.accessor('items', {
      header: 'Products',
      cell: (info) => {
        const items = info.getValue();
        return (
          <div className="max-w-xs">
            {items && items.map((item, index) => (
              <div key={index} className="text-sm text-gray-600">
                {item.product} (x{item.quantity})
              </div>
            ))}
          </div>
        );
      },
    }),
    columnHelper.accessor('total_quantity', {
      header: 'Total Qty',
      cell: (info) => {
        return (
          <div className="text-center font-medium">
            {info.getValue()}
          </div>
        );
      },
    }),
    columnHelper.accessor('total_amount', {
      header: 'Total Amount',
      cell: (info) => {
        const amount = parseFloat(info.getValue());
        return (
          <div className="font-semibold text-gray-900">
            KSh {amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        );
      },
    }),
    columnHelper.accessor('payment_method', {
      header: 'Payment Method',
      cell: (info) => {
        const method = info.getValue();
        const displayMethod = method === 'mpesa' ? 'M-Pesa' : 
                            method === 'cash_on_delivery' ? 'Cash on Delivery' : 
                            method.charAt(0).toUpperCase() + method.slice(1);
        
        return (
          <div className="text-gray-600">
            {displayMethod}
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
          processing: 'bg-purple-100 text-purple-800 border border-purple-200',
        };
        
        if (isEditing) {
          return (
            <select
              value={status || ''}
              onChange={(e) => handleEditChange('status', e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="shipped">Shipped</option>
              <option value="cancelled">Cancelled</option>
            </select>
          );
        }
        
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    }),
    columnHelper.accessor('created_at', {
      header: 'Date',
      cell: (info) => {
        const dateString = info.getValue();
        return (
          <div className="text-gray-600">
            {new Date(dateString).toLocaleDateString('en-KE', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
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
              onClick={() => handleMarkAsShipped(order)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Mark as Shipped"
              disabled={order.status === 'shipped' || order.status === 'cancelled'}
            >
              <TruckIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleCancelOrder(order)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="Cancel Order"
              disabled={order.status === 'cancelled' || order.status === 'completed'}
            >
              <XCircleIcon className="w-5 h-5" />
            </button>
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
  const handleMarkAsShipped = async (order) => {
    if (await updateOrderStatus(order.id, 'shipped')) {
      // Success handled in updateOrderStatus
    }
  };

  const handleCancelOrder = async (order) => {
    if (confirm(`Are you sure you want to cancel order #${order.id}? This action cannot be undone.`)) {
      if (await updateOrderStatus(order.id, 'cancelled')) {
        // Success handled in updateOrderStatus
      }
    }
  };

  const handlePrintReceipt = (order) => {
    console.log('Print receipt for order:', order);
    
    const printWindow = window.open('', '_blank');
    const itemsHtml = order.items.map(item => `
      <div class="item-row">
        <p><strong>${item.product}</strong> (x${item.quantity})</p>
        <p>KSh ${parseFloat(item.price).toLocaleString('en-KE', { minimumFractionDigits: 2 })} each</p>
        <p>Subtotal: KSh ${parseFloat(item.subtotal).toLocaleString('en-KE', { minimumFractionDigits: 2 })}</p>
      </div>
    `).join('');
    
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
            .item-row { border-bottom: 1px solid #eee; padding: 5px 0; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <h2>ORDER RECEIPT</h2>
              <p>Order #${order.id}</p>
            </div>
            <div class="section">
              <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-KE')}</p>
              <p><strong>Customer:</strong> ${order.customer_name || 'N/A'}</p>
              <p><strong>Email:</strong> ${order.customer_email || 'N/A'}</p>
              <p><strong>Phone:</strong> ${order.customer_phone || order.mpesa_phone_number || 'N/A'}</p>
            </div>
            <div class="section">
              <h4>Order Items:</h4>
              ${itemsHtml}
              <p class="total">Total: KSh ${parseFloat(order.total_amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}</p>
            </div>
            <div class="section">
              <p><strong>Payment Method:</strong> ${order.payment_method === 'mpesa' ? 'M-Pesa' : 'Cash on Delivery'}</p>
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
    
    const itemsHtml = order.items.map(item => `
      <div class="border-b border-gray-200 py-3">
        <div class="flex justify-between items-start">
          <div>
            <p class="font-medium">${item.product}</p>
            <p class="text-sm text-gray-600">Quantity: ${item.quantity}</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">Price: KSh ${parseFloat(item.price).toLocaleString('en-KE', { minimumFractionDigits: 2 })}</p>
            <p class="font-semibold">Subtotal: KSh ${parseFloat(item.subtotal).toLocaleString('en-KE', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>
    `).join('');
    
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
              <p><strong>Name:</strong> ${order.customer_name || 'N/A'}</p>
              <p><strong>Email:</strong> ${order.customer_email || 'N/A'}</p>
              <p><strong>Phone:</strong> ${order.customer_phone || order.mpesa_phone_number || 'N/A'}</p>
              <p><strong>Order Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-KE', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
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
                  order.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }">
                  ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </p>
              <p><strong>Payment Method:</strong> ${order.payment_method === 'mpesa' ? 'M-Pesa' : 'Cash on Delivery'}</p>
              <p><strong>Total Quantity:</strong> ${order.total_quantity}</p>
              <p><strong>Total Amount:</strong> KSh ${parseFloat(order.total_amount).toLocaleString('en-KE', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-6">
          <h4 class="font-semibold text-gray-700 mb-2">Order Items</h4>
          <div class="border rounded-lg p-4">
            ${itemsHtml}
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

  const handleExportCSV = () => {
    const headers = ['ID', 'Customer Name', 'Customer Email', 'Phone', 'Total Quantity', 'Total Amount', 'Payment Method', 'Status', 'Date'];
    const csvData = filteredData.map(order => [
      order.id,
      order.customer_name || 'N/A',
      order.customer_email || 'N/A',
      order.customer_phone || order.mpesa_phone_number || 'N/A',
      order.total_quantity,
      parseFloat(order.total_amount).toFixed(2),
      order.payment_method,
      order.status,
      new Date(order.created_at).toLocaleDateString('en-KE')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 font flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

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
                  <CheckIcon className="w-4 h-4 text-white" />
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
                  <TruckIcon className="w-4 h-4 text-white" />
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
                  <XCircleIcon className="w-4 h-4 text-white" />
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
                  placeholder="Search orders by customer name, order ID, or phone..."
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
                  <option value="processing">Processing</option>
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