"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import TextArea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";

interface TradingSignal {
  id: string;
  title: string;
  symbol: string;
  action: string;
  entry: string;
  takeProfit: string;
  stopLoss: string;
  confidence: string;
  description: string | null;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function AdminSignalsPage() {
  const { data: session } = useSession();
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    symbol: "",
    action: "BUY",
    entry: "",
    takeProfit: "",
    stopLoss: "",
    confidence: "80",
    description: "",
    content: ""
  });
  const [image, setImage] = useState<File | null>(null);

  // Check if user is admin - use optional chaining for safe access
  const isAdmin = session?.user?.role === 'ADMIN_L1' ||
                  session?.user?.role === 'ADMIN_L2' ||
                  session?.user?.role === 'OWNER';

  const fetchSignals = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/signals?page=${pagination.page}&limit=${pagination.limit}`
      );
      
      const result = await response.json();
      
      if (result.success) {
        setSignals(result.data.signals);
        setPagination(result.data.pagination);
      } else {
        toast.error(result.error || "Failed to fetch signals");
      }
    } catch (error) {
      console.error("Fetch signals error:", error);
      toast.error("Failed to fetch signals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSignals();
    }
  }, [session, pagination.page]);

  const handleCreateSignal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('symbol', formData.symbol);
      formDataToSend.append('action', formData.action);
      formDataToSend.append('entry', formData.entry);
      formDataToSend.append('takeProfit', formData.takeProfit);
      formDataToSend.append('stopLoss', formData.stopLoss);
      formDataToSend.append('confidence', formData.confidence);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('content', formData.content);
      
      if (image) {
        formDataToSend.append('image', image);
      }

      const response = await fetch("/api/admin/signals/upload", {
        method: "POST",
        body: formDataToSend
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success("Signal created successfully");
        setIsCreating(false);
        setFormData({
          title: "",
          symbol: "",
          action: "BUY",
          entry: "",
          takeProfit: "",
          stopLoss: "",
          confidence: "80",
          description: "",
          content: ""
        });
        setImage(null);
        fetchSignals();
      } else {
        toast.error(result.error || "Failed to create signal");
      }
    } catch (error) {
      console.error("Create signal error:", error);
      toast.error("Failed to create signal");
    }
  };

  const handleDeleteSignal = async (id: string) => {
    if (!confirm("Are you sure you want to delete this signal?")) return;
    
    try {
      const response = await fetch(`/api/admin/signals/${id}`, {
        method: "DELETE"
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success("Signal deleted successfully");
        fetchSignals();
      } else {
        toast.error(result.error || "Failed to delete signal");
      }
    } catch (error) {
      console.error("Delete signal error:", error);
      toast.error("Failed to delete signal");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  if (!session) {
    return (
      <div className="p-6">
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <div className="text-center py-8">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Access Denied</h3>
            <p className="text-slate-600">You need to be logged in to access this page.</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
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
        <h1 className="text-2xl font-bold text-slate-800">Trading Signals Management</h1>
        
        <Button 
          variant="primary" 
          onClick={() => setIsCreating(!isCreating)}
        >
          {isCreating ? "Cancel" : "Create New Signal"}
        </Button>
      </div>

      {isCreating && (
        <Card className="mb-8 p-6 rounded-2xl shadow-soft-lg bg-white">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Create New Signal</h2>
          
          <form onSubmit={handleCreateSignal} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Title"
                placeholder="e.g., EUR/USD Buy Signal"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              
              <Input
                label="Symbol"
                placeholder="e.g., EUR/USD"
                value={formData.symbol}
                onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Action"
                value={formData.action}
                onChange={(e) => setFormData({...formData, action: e.target.value})}
                options={[
                  { value: "BUY", label: "BUY" },
                  { value: "SELL", label: "SELL" }
                ]}
              />
              
              <Input
                label="Entry"
                type="text"
                placeholder="e.g., 1.0850"
                value={formData.entry}
                onChange={(e) => setFormData({...formData, entry: e.target.value})}
                required
              />
              
              <Input
                label="Take Profit"
                type="text"
                placeholder="e.g., 1.0900"
                value={formData.takeProfit}
                onChange={(e) => setFormData({...formData, takeProfit: e.target.value})}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Stop Loss"
                type="text"
                placeholder="e.g., 1.0800"
                value={formData.stopLoss}
                onChange={(e) => setFormData({...formData, stopLoss: e.target.value})}
                required
              />
              
              <Input
                label="Confidence (%)"
                type="text"
                placeholder="e.g., 85"
                value={formData.confidence}
                onChange={(e) => setFormData({...formData, confidence: e.target.value})}
                required
              />
              
              <Input
                label="Description"
                placeholder="Signal description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <TextArea
                label="Content"
                placeholder="Detailed signal analysis..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={6}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <label className="block text-sm font-medium text-slate-700">
                Chart Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCreating(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create Signal
              </Button>
            </div>
          </form>
        </Card>
      )}

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
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Symbol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Entry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Take Profit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Stop Loss
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {signals.map((signal) => (
                    <tr key={signal.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {signal.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">
                          {signal.symbol}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          signal.action === 'BUY' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {signal.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {signal.entry}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {signal.takeProfit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {signal.stopLoss}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">
                          {signal.confidence}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {formatDate(signal.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteSignal(signal.id)}
                        >
                          Delete
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
              } of {pagination.total} signals
            </div>
            
            <Pagination 
              currentPage={pagination.page} 
              totalPages={pagination.pages} 
              onPageChange={handlePageChange} 
            />
          </div>
        </>
      )}
    </div>
  );
}
