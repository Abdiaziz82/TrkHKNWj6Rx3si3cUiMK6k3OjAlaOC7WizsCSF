import React, { useState, useMemo } from "react";
import { 
  UserCircle, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  MoreVertical,
  Star,
  CreditCard,
  TrendingUp
} from "lucide-react";
import RetailerDetail from "./RetailerDetail";

// Mock data for retailers
const mockRetailers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+255 123 456 789",
    location: "Dar es Salaam",
    businessName: "Doe Supermarket",
    registrationDate: "2024-01-15",
    status: "Active",
    creditLimit: 5000000,
    creditUsed: 2500000,
    creditStatus: "Good",
    loyaltyPoints: 1500,
    totalOrders: 45,
    totalSpent: 12500000,
    lastOrder: "2024-12-15"
  },
  {
    id: 2,
    name: "Sarah Smith",
    email: "sarah@example.com",
    phone: "+255 987 654 321",
    location: "Arusha",
    businessName: "Smith Retail Store",
    registrationDate: "2024-02-20",
    status: "Active",
    creditLimit: 3000000,
    creditUsed: 2800000,
    creditStatus: "Warning",
    loyaltyPoints: 800,
    totalOrders: 32,
    totalSpent: 8400000,
    lastOrder: "2024-12-14"
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    phone: "+255 456 789 123",
    location: "Mwanza",
    businessName: "Johnson Wholesale",
    registrationDate: "2024-03-10",
    status: "Inactive",
    creditLimit: 7000000,
    creditUsed: 0,
    creditStatus: "Excellent",
    loyaltyPoints: 2500,
    totalOrders: 67,
    totalSpent: 18700000,
    lastOrder: "2024-11-30"
  },
  {
    id: 4,
    name: "Emily Brown",
    email: "emily@example.com",
    phone: "+255 321 654 987",
    location: "Dodoma",
    businessName: "Brown Trading Co.",
    registrationDate: "2024-04-05",
    status: "Active",
    creditLimit: 4000000,
    creditUsed: 3900000,
    creditStatus: "Critical",
    loyaltyPoints: 1200,
    totalOrders: 28,
    totalSpent: 9600000,
    lastOrder: "2024-12-13"
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david@example.com",
    phone: "+255 789 123 456",
    location: "Mbeya",
    businessName: "Wilson Retail Hub",
    registrationDate: "2024-05-12",
    status: "Active",
    creditLimit: 6000000,
    creditUsed: 3200000,
    creditStatus: "Good",
    loyaltyPoints: 2100,
    totalOrders: 51,
    totalSpent: 14300000,
    lastOrder: "2024-12-12"
  }
];

// Mock order history data
const mockOrderHistory = [
  { id: 1, retailerId: 1, date: "2024-12-15", amount: 450000, status: "Delivered", items: 12 },
  { id: 2, retailerId: 1, date: "2024-12-10", amount: 320000, status: "Delivered", items: 8 },
  { id: 3, retailerId: 1, date: "2024-12-05", amount: 280000, status: "Delivered", items: 6 },
  { id: 4, retailerId: 2, date: "2024-12-14", amount: 380000, status: "Processing", items: 10 },
  { id: 5, retailerId: 2, date: "2024-12-08", amount: 290000, status: "Delivered", items: 7 },
];

function RetailerList() {
  const [selectedRetailer, setSelectedRetailer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter retailers based on search and status
  const filteredRetailers = useMemo(() => {
    return mockRetailers.filter(retailer => {
      const matchesSearch = 
        retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        retailer.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        retailer.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || retailer.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRetailers.length / itemsPerPage);
  const paginatedRetailers = filteredRetailers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCreditStatusColor = (status) => {
    switch (status) {
      case "Excellent": return "bg-green-100 text-green-800";
      case "Good": return "bg-blue-100 text-blue-800";
      case "Warning": return "bg-yellow-100 text-yellow-800";
      case "Critical": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewDetails = (retailer) => {
    setSelectedRetailer(retailer);
    setView("detail");
  };

  if (view === "detail" && selectedRetailer) {
    return (
      <RetailerDetail 
        retailer={selectedRetailer} 
        onBack={() => setView("list")}
        orderHistory={mockOrderHistory.filter(order => order.retailerId === selectedRetailer.id)}
        formatCurrency={formatCurrency}
        getCreditStatusColor={getCreditStatusColor}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 font">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Retailer Profiles</h1>
            <p className="text-gray-600 mt-1">Manage and view all retailer information</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <UserCircle className="w-5 h-5" />
            <span>Add Retailer</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Retailers</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{mockRetailers.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Retailers</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {mockRetailers.filter(r => r.status === "Active").length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Credit Limit</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCurrency(mockRetailers.reduce((sum, r) => sum + r.creditLimit, 0))}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Loyalty Points</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {Math.round(mockRetailers.reduce((sum, r) => sum + r.loyaltyPoints, 0) / mockRetailers.length)}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600 fill-current" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search retailers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 text-sm"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Filter className="w-4 h-4" />
                <span>More Filters</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Retailers Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retailer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credit Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loyalty Points</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedRetailers.map((retailer) => (
                  <tr 
                    key={retailer.id} 
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleViewDetails(retailer)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-xs">
                            {retailer.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900 text-sm">{retailer.name}</div>
                          <div className="text-xs text-gray-500">{retailer.businessName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-left">
                        <div className="text-sm text-gray-900">{retailer.email}</div>
                        <div className="text-xs text-gray-500">{retailer.phone}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {retailer.location}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCreditStatusColor(retailer.creditStatus)}`}>
                        {retailer.creditStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-semibold text-sm">{retailer.loyaltyPoints}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {retailer.totalOrders}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        retailer.status === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {retailer.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(retailer);
                          }}
                          className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {paginatedRetailers.length} of {filteredRetailers.length} retailers
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RetailerList;