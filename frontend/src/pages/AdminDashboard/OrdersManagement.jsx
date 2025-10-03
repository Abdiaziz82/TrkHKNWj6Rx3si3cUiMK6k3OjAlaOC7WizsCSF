import React, { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, getPaginationRowModel } from '@tanstack/react-table';
import AIBot from './AIBot';
import OrderManagement from './OrderManagement';
import TableSection from './TableSection';

function OrdersManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "👋 Hello! I'm your AI Order Assistant. I can help you:\n\n• Create new orders via chat\n• Update order status\n• Search and filter orders\n• Generate order insights\n• Process bulk uploads\n\nTry saying: 'Customer +1 (555) 123-4567 wants to order 3 bags of sugar'", 
      sender: 'ai', 
      timestamp: new Date(),
      type: 'info'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Enhanced orders data with more realistic information
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer_phone: "+1 (555) 123-4567",
      customer_name: "John Smith",
      product_name: "Sugar 50kg",
      quantity: 2,
      unit_price: 45.99,
      total_price: 91.98,
      order_method: "chatbot",
      status: "pending",
      created_at: new Date('2024-01-15'),
      notes: "Urgent delivery requested"
    },
    {
      id: 2,
      customer_phone: "+1 (555) 987-6543",
      customer_name: "Maria Garcia",
      product_name: "Coffee Beans 1kg",
      quantity: 5,
      unit_price: 28.50,
      total_price: 142.50,
      order_method: "phone",
      status: "completed",
      created_at: new Date('2024-01-14'),
      notes: "Regular customer"
    },
    {
      id: 3,
      customer_phone: "+1 (555) 456-7890",
      customer_name: "David Johnson",
      product_name: "Flour 25kg",
      quantity: 10,
      unit_price: 32.75,
      total_price: 327.50,
      order_method: "website",
      status: "processing",
      created_at: new Date('2024-01-16'),
      notes: "Bulk order discount applied"
    }
  ]);

  const [editingOrder, setEditingOrder] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');

  const [formData, setFormData] = useState({
    customer_phone: '',
    customer_name: '',
    product_name: '',
    quantity: '',
    unit_price: '',
    notes: ''
  });

  // Product catalog for AI to reference
  const productCatalog = [
    { name: "Sugar 50kg", price: 45.99, category: "basics" },
    { name: "Coffee Beans 1kg", price: 28.50, category: "beverages" },
    { name: "Flour 25kg", price: 32.75, category: "basics" },
    { name: "Rice 20kg", price: 38.25, category: "basics" },
    { name: "Tea Leaves 500g", price: 15.75, category: "beverages" }
  ];

  // Define columns for TanStack Table
  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 60,
    },
    {
      accessorKey: 'customer_name',
      header: 'Customer Name',
      size: 150,
    },
    {
      accessorKey: 'customer_phone',
      header: 'Phone',
      size: 150,
    },
    {
      accessorKey: 'product_name',
      header: 'Product',
      size: 150,
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      size: 80,
    },
    {
      accessorKey: 'unit_price',
      header: 'Unit Price',
      size: 100,
      cell: ({ getValue }) => `$${getValue().toFixed(2)}`,
    },
    {
      accessorKey: 'total_price',
      header: 'Total',
      size: 100,
      cell: ({ getValue }) => `$${getValue().toFixed(2)}`,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 120,
      cell: ({ getValue }) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          getValue() === 'completed' ? 'bg-green-100 text-green-800' :
          getValue() === 'processing' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {getValue()}
        </span>
      ),
    },
    {
      accessorKey: 'created_at',
      header: 'Date',
      size: 120,
      cell: ({ getValue }) => getValue().toLocaleDateString(),
    },
  ], []);

  // Initialize TanStack Table
  const table = useReactTable({
    data: orders,
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

  // Enhanced AI order processing
  const processOrderCommand = (text) => {
    setIsProcessing(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const lowerText = text.toLowerCase();
      
      // Create new order
      if (lowerText.includes('order') || lowerText.includes('create') || lowerText.includes('new')) {
        // Extract phone number
        const phoneMatch = text.match(/\+1\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/);
        const phone = phoneMatch ? phoneMatch[0] : '+1 (555) XXX-XXXX';
        
        // Extract quantity
        const quantityMatch = text.match(/\b(\d+)\s*(bags?|units?|pieces?|kgs?)?\b/i);
        const quantity = quantityMatch ? parseInt(quantityMatch[1]) : 1;
        
        // Find product
        const product = productCatalog.find(p => 
          lowerText.includes(p.name.toLowerCase().split(' ')[0])
        ) || productCatalog[0];
        
        const newOrder = {
          id: Math.max(...orders.map(o => o.id)) + 1,
          customer_phone: phone,
          customer_name: 'New Customer',
          product_name: product.name,
          quantity: quantity,
          unit_price: product.price,
          total_price: product.price * quantity,
          order_method: 'chatbot',
          status: 'pending',
          created_at: new Date(),
          notes: `Created via AI chat: "${text}"`
        };
        
        setOrders(prev => [...prev, newOrder]);
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: `✅ Order created successfully!\n\n• Customer: ${phone}\n• Product: ${product.name}\n• Quantity: ${quantity}\n• Total: $${(product.price * quantity).toFixed(2)}\n\nOrder #${newOrder.id} is now pending.`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'success'
        }]);
        
        // Auto-filter to show the new order
        setGlobalFilter(phone);
      }
      // Search orders
      else if (lowerText.includes('search') || lowerText.includes('find') || lowerText.includes('lookup')) {
        const searchTerm = text.replace(/search|find|lookup|for|orders?/gi, '').trim();
        if (searchTerm) {
          setGlobalFilter(searchTerm);
          setMessages(prev => [...prev, {
            id: Date.now(),
            text: `🔍 Searching orders for: "${searchTerm}"\n\nFound ${table.getRowModel().rows.length} matching orders.`,
            sender: 'ai',
            timestamp: new Date(),
            type: 'info'
          }]);
        }
      }
      // Status update
      else if (lowerText.includes('status') || lowerText.includes('update')) {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: `To update an order status, click the status badge in the orders table or use the edit button. I can help you search for specific orders first!`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'info'
        }]);
      }
      // Default response
      else {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: `I can help you with:\n\n• Creating new orders\n• Searching existing orders\n• Order status updates\n• Product information\n\nTry something like: "Create order for 2 bags of coffee for customer +1 (555) 999-8888"`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'info'
        }]);
      }
      
      setIsProcessing(false);
    }, 1500);
  };

  const handleSendMessage = async (text = inputText) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    
    // Process AI response
    processOrderCommand(text);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingOrder) {
      setOrders(prev => prev.map(order => 
        order.id === editingOrder.id 
          ? { ...editingOrder, ...formData, total_price: formData.quantity * formData.unit_price }
          : order
      ));
      setEditingOrder(null);
    } else {
      const newOrder = {
        id: Math.max(...orders.map(o => o.id), 0) + 1,
        ...formData,
        quantity: parseInt(formData.quantity),
        unit_price: parseFloat(formData.unit_price),
        total_price: parseFloat(formData.quantity) * parseFloat(formData.unit_price),
        order_method: "manual",
        status: "pending",
        created_at: new Date()
      };
      setOrders(prev => [...prev, newOrder]);
    }
    
    setFormData({
      customer_phone: '',
      customer_name: '',
      product_name: '',
      quantity: '',
      unit_price: '',
      notes: ''
    });
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      customer_phone: order.customer_phone,
      customer_name: order.customer_name,
      product_name: order.product_name,
      quantity: order.quantity,
      unit_price: order.unit_price,
      notes: order.notes || ''
    });
  };

  const handleDelete = (id) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  const handleStatusChange = (id, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, status: newStatus } : order
    ));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simulate file processing
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now(),
          text: `📁 File "${file.name}" processed successfully! Added 3 new orders from bulk upload.`,
          sender: 'ai',
          timestamp: new Date(),
          type: 'success'
        }]);
      }, 2000);
    }
  };

  const exportOrders = () => {
    const dataStr = JSON.stringify(orders, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `orders_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <AIBot
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        messages={messages}
        setMessages={setMessages}
        inputText={inputText}
        setInputText={setInputText}
        isListening={isListening}
        setIsListening={setIsListening}
        isProcessing={isProcessing}
        handleSendMessage={handleSendMessage}
        processOrderCommand={processOrderCommand}
        productCatalog={productCatalog}
        orders={orders}
        setGlobalFilter={setGlobalFilter}
        table={table}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <OrderManagement
          orders={orders}
          setOrders={setOrders}
          editingOrder={editingOrder}
          setEditingOrder={setEditingOrder}
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleFileUpload={handleFileUpload}
          exportOrders={exportOrders}
          setSidebarOpen={setSidebarOpen}
          productCatalog={productCatalog}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleStatusChange={handleStatusChange}
        />

        <TableSection
          table={table}
          orders={orders}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handleStatusChange={handleStatusChange}
        />
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default OrdersManagement;