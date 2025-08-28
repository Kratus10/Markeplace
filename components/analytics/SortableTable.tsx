// FILE: components/analytics/SortableTable.tsx
import React, { useState, useMemo } from "react";
import Card from "@/components/ui/Card";

interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface SortableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  title: string;
  ariaLabel: string;
  searchable?: boolean;
  defaultSortColumn?: keyof T;
  defaultSortDirection?: 'asc' | 'desc';
  className?: string;
}

export default function SortableTable<T extends Record<string, any>>({
  data,
  columns,
  title,
  ariaLabel,
  searchable = false,
  defaultSortColumn,
  defaultSortDirection = 'asc',
  className = ""
}: SortableTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof T | undefined>(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);

  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm) return data;
    
    return data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, searchable]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
      if (bValue == null) return sortDirection === 'asc' ? 1 : -1;
      
      // Compare values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }
      
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const handleSort = (columnKey: keyof T) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  return (
    <Card className={`p-6 rounded-2xl shadow-soft-lg bg-white ${className}`} role="region" aria-label={ariaLabel}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        {searchable && (
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              aria-label="Search table data"
            />
          </div>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${
                    column.sortable !== false ? 'cursor-pointer hover:bg-slate-100' : ''
                  }`}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  aria-sort={
                    sortColumn === column.key
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <div className="flex items-center">
                    {column.title}
                    {column.sortable !== false && sortColumn === column.key && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sortedData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-slate-50">
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {column.render ? column.render(row[column.key], row) : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sortedData.length === 0 && (
        <div className="p-8 text-center text-slate-500">
          <p>No data available</p>
          {searchable && searchTerm && (
            <p className="text-sm mt-1">No results match your search criteria</p>
          )}
        </div>
      )}
    </Card>
  );
}