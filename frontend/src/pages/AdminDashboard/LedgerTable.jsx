import React from "react";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from "@tanstack/react-table";
import { Search, Filter, Download, Eye, Edit, MoreVertical, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const LedgerTable = ({ 
  data, 
  filterStatus, 
  setFilterStatus, 
  filterPaymentMethod, 
  setFilterPaymentMethod, 
  searchTerm, 
  setSearchTerm, 
  formatCurrency 
}) => {
  
  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      paid: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Paid" },
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
      overdue: { color: "bg-red-100 text-red-800", icon: AlertTriangle, label: "Overdue" }
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${config.color}`}>
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </span>
    );
  };

  // Payment Method Badge
  const PaymentMethodBadge = ({ method }) => {
    const methodConfig = {
      cash: { color: "bg-gray-100 text-gray-800", label: "Cash" },
      mobile_money: { color: "bg-purple-100 text-purple-800", label: "Mobile Money" },
      credit: { color: "bg-blue-100 text-blue-800", label: "Credit" }
    };

    const config = methodConfig[method] || methodConfig.cash;

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Define columns for the table
  const columns = [
    {
      accessorKey: "retailer",
      header: "Retailer",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-gray-900 text-sm">{row.original.retailer}</div>
          <div className="text-xs text-gray-500">{row.original.business}</div>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div>
          <div className="font-semibold text-gray-900 text-sm">
            {formatCurrency(row.original.amount)}
          </div>
          {row.original.remainingAmount > 0 && (
            <div className="text-xs text-red-600">
              Due: {formatCurrency(row.original.remainingAmount)}
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: "Method",
      cell: ({ row }) => <PaymentMethodBadge method={row.original.paymentMethod} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1 text-sm text-gray-900">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{new Date(row.original.dueDate).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      accessorKey: "transactionDate",
      header: "Transaction Date",
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">
          {new Date(row.original.transactionDate).toLocaleDateString()}
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <div className="text-sm text-gray-900">{row.original.location}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <button className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200">
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>

            {/* Payment Method Filter */}
            <select
              value={filterPaymentMethod}
              onChange={(e) => setFilterPaymentMethod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Methods</option>
              <option value="cash">Cash</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="credit">Credit</option>
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
                  <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Showing {table.getRowModel().rows.length} of {data.length} transactions
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm text-gray-700">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LedgerTable;