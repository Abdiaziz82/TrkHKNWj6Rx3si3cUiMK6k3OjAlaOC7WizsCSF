import React from 'react';
import { Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

function TableSection({
  table,
  orders,
  globalFilter,
  setGlobalFilter,
  handleEdit,
  handleDelete,
  handleStatusChange
}) {
  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'N/A';
    
    // If it's already a Date object
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    
    // If it's a string, convert to Date first
    try {
      return new Date(date).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Format currency for display
  const formatCurrency = (value) => {
    if (typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }
    return value;
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        {/* Global Filter */}
        <div className="mb-4">
          <input
            type="text"
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search all orders..."
            className="block w-full max-w-md border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={header.column.getToggleSortingHandler()}
                        style={{ width: header.getSize() }}
                      >
                        <div className="flex items-center space-x-1">
                          <span>{header.column.columnDef.header}</span>
                          {{
                            asc: <ChevronUp className="h-4 w-4" />,
                            desc: <ChevronDown className="h-4 w-4" />,
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      </th>
                    ))}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(() => {
                          const cellValue = cell.getValue();
                          
                          // Handle different column types
                          switch (cell.column.id) {
                            case 'created_at':
                              return formatDate(cellValue);
                              
                            case 'unit_price':
                            case 'total_price':
                              return formatCurrency(cellValue);
                              
                            case 'status':
                              return (
                                <select
                                  value={cellValue}
                                  onChange={(e) => handleStatusChange(row.original.id, e.target.value)}
                                  className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 focus:ring-blue-500 ${
                                    cellValue === 'completed' ? 'bg-green-100 text-green-800' :
                                    cellValue === 'processing' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="processing">Processing</option>
                                  <option value="completed">Completed</option>
                                </select>
                              );
                              
                            default:
                              // For other columns, just return the value as string
                              return String(cellValue || '');
                          }
                        })()}
                      </td>
                    ))}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(row.original)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(row.original.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {'<<'}
                </button>
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {'<'}
                </button>
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {'>'}
                </button>
                <button
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {'>>'}
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </span>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={e => table.setPageSize(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-2 py-1 text-sm"
                >
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TableSection;