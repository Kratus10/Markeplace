'use client'

import { useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'

interface QueueItem {
  id: string
  title: string
  source: string
  status: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  created: string
}

interface QueueTableProps {
  items: QueueItem[]
}

interface QueueItem {
  id: string
  title: string
  source: string
  status: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  created: string
}

interface QueueTableProps {
  items: QueueItem[]
}

export default function QueueTable({ items }: QueueTableProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedItems([]);
      setAllSelected(false);
    } else {
      setSelectedItems(items.map(item => item.id));
      setAllSelected(true);
    }
  };

  const toggleItemSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkAction = (action: string) => {
    // Implement bulk action logic here
    console.log(`Performing ${action} on items:`, selectedItems);
    // Would typically call API to perform bulk action
    setSelectedItems([]);
    setAllSelected(false);
  };

  const priorityClasses = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  }

  return (
    <Card>
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">Selected: {selectedItems.length} items</h3>
          <div className="flex gap-2">
            <button 
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition"
              onClick={() => handleBulkAction('approve')}
            >
              Approve Selected
            </button>
            <button 
              className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition"
              onClick={() => handleBulkAction('remove')}
            >
              Remove Selected
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(item.id)}
                    onChange={() => toggleItemSelection(item.id)}
                    className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.source}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityClasses[item.priority]}`}>
                    {item.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.created}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/admin/moderation/item/${item.id}`}>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
