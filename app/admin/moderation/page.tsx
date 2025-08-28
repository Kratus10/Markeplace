// FILE: app/admin/moderation/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface ModerationItem {
  id: string;
  targetType: string;
  targetId: string;
  action: string;
  reason: string | null;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function AdminModerationPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<ModerationItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [action, setAction] = useState("");
  const [reason, setReason] = useState("");

  const fetchFlaggedItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/moderation/flagged?page=${pagination.page}&limit=${pagination.limit}&status=${statusFilter}&type=${typeFilter}`
      );
      
      const result = await response.json();
      
      if (result.success) {
        setItems(result.data.items);
        setPagination(result.data.pagination);
      } else {
        toast.error(result.error || "Failed to fetch flagged content");
      }
    } catch (error) {
      console.error("Fetch flagged items error:", error);
      toast.error("Failed to fetch flagged content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchFlaggedItems();
    }
  }, [session, pagination.page, statusFilter, typeFilter]);

  const handleAction = async (itemId: string) => {
    if (!action) {
      toast.error("Please select an action");
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/moderation/${itemId}/action`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ action, reason })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success("Action completed successfully");
        setSelectedItem(null);
        setAction("");
        setReason("");
        fetchFlaggedItems();
      } else {
        toast.error(result.error || "Failed to perform action");
      }
    } catch (error) {
      console.error("Moderation action error:", error);
      toast.error("Failed to perform action");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="p-6">
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <div className="text-center py-8">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Access Denied</h3>
            <p className="text-slate-600">You don't have permission to access this page.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Content Moderation</h1>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="TOPIC">Topics</option>
            <option value="COMMENT">Comments</option>
            <option value="USER">Users</option>
          </select>
          
          <Button variant="outline" onClick={fetchFlaggedItems}>
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-soft-lg p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <Card className="rounded-2xl shadow-soft-lg bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Reported By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {item.targetType} #{item.targetId.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.targetType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {item.reason || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'PENDING' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {item.user ? (
                          <div>
                            <div>{item.user.name || item.user.email}</div>
                            <div className="text-xs text-slate-400">{item.user.email}</div>
                          </div>
                        ) : (
                          'System'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedItem(item)}
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-slate-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {
                Math.min(pagination.page * pagination.limit, pagination.total)
              } of {pagination.total} items
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center">
                <span className="text-sm text-slate-700 mr-2">Page</span>
                <input
                  type="number"
                  min="1"
                  max={pagination.pages}
                  value={pagination.page}
                  onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 border border-slate-300 rounded text-sm text-center"
                />
                <span className="text-sm text-slate-700 mx-2">of {pagination.pages}</span>
              </div>
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Action Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Moderate Content</h3>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-slate-600 mb-1">Content Type:</div>
              <div className="font-medium">{selectedItem.targetType}</div>
            </div>
            
            <div className="mb-4">
              <div className="text-sm text-slate-600 mb-1">Reason:</div>
              <div className="font-medium">{selectedItem.reason || 'N/A'}</div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Action
              </label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an action</option>
                <option value="APPROVE">Approve Content</option>
                <option value="HIDE">Hide Content</option>
                <option value="DELETE">Delete Content</option>
                {selectedItem.targetType === 'USER' && (
                  <option value="BAN_USER">Ban User</option>
                )}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Reason (optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Provide reasoning for your action..."
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setSelectedItem(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleAction(selectedItem.id)}
              >
                Submit Action
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
