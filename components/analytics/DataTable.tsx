// FILE: components/analytics/DataTable.tsx
import React, { useState, useMemo } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

interface Column {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  title: string;
  ariaLabel: string;
  searchable?: boolean;
  sortable?: boolean;
  defaultSortColumn?: string;
  defaultSortDirection?: 'asc' | 'desc';
}

export default function DataTable({
  data,
  columns,
  title,
  ariaLabel,
  searchable = false,
  sortable = true,
  defaultSortColumn,
  defaultSortDirection = 'asc'
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState(defaultSortColumn || '');
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
    if (!sortable || !sortColumn) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection, sortable]);

  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  return (
    <Card className="p-6 rounded-2xl shadow-soft-lg bg-white" role="region" aria-label={ariaLabel}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        {searchable && (
          <div className="w-full md:w-64">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${
                    sortable && column.sortable !== false ? 'cursor-pointer hover:bg-slate-100' : ''
                  }`}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  aria-sort={
                    sortable && column.sortable !== false && sortColumn === column.key
                      ? sortDirection === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <div className="flex items-center">
                    {column.title}
                    {sortable && column.sortable !== false && sortColumn === column.key && (
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
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
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