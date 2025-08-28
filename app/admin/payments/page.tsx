// FILE: app/admin/payments/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowTrendingUpIcon, 
  CreditCardIcon, 
  CurrencyDollarIcon, 
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ChartBarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface Payment {
  id: string;
  orderId: string;
  provider: string;
  amountCents: number;
  currency: string;
  status: string;
  transactionId: string | null;
  createdAt: string;
}

interface PaymentStats {
  totalRevenue: number;
  totalPayments: number;
  pendingPayments: number;
  failedPayments: number;
  successRate: number;
  averagePayment: number;
  revenueTrend: Array<{
    date: string;
    amount: number;
  }>;
  providerDistribution: Array<{
    name: string;
    value: number;
  }>;
  statusDistribution: Array<{
    name: string;
    value: number;
  }>;
}

const PaymentsDashboard = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [providerFilter, setProviderFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/payments?timeRange=${timeRange}`);
      const result = await response.json();
      
      if (result.success) {
        setPayments(result.data.payments);
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [timeRange]);

  const handleExport = async (format: string) => {
    try {
      const response = await fetch(`/api/admin/payments/export?format=${format}&timeRange=${timeRange}`);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-report-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting payments:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Payment Monitoring</h1>
          <div className="h-10 w-48 bg-slate-200 rounded animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-4 rounded-2xl shadow-soft-lg bg-white animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6 rounded-2xl shadow-soft-lg bg-white animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
            <div className="h-80 bg-slate-200 rounded"></div>
          </div>
          <div className="card p-6 rounded-2xl shadow-soft-lg bg-white animate-pulse">
            <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
            <div className="h-80 bg-slate-200 rounded"></div>
          </div>
        </div>
        
        <div className="card p-6 rounded-2xl shadow-soft-lg bg-white animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Payment Monitoring</h1>
        <div className="flex gap-2">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={[
              { value: '7d', label: 'Last 7 Days' },
              { value: '30d', label: 'Last 30 Days' },
              { value: '90d', label: 'Last 90 Days' }
            ]}
          />
          <div className="relative">
            <Button variant="outline" onClick={() => handleExport('csv')}>
              <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          </div>
          <Button variant="outline" onClick={fetchPayments}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="p-4 rounded-2xl shadow-soft-lg bg-white">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <CurrencyDollarIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-500">Total Revenue</p>
                <p className="text-xl font-bold">${(stats.totalRevenue / 100).toFixed(2)}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 rounded-2xl shadow-soft-lg bg-white">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <ArrowDownTrayIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-500">Total Payments</p>
                <p className="text-xl font-bold">{stats.totalPayments}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 rounded-2xl shadow-soft-lg bg-white">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                <ArrowTrendingUpIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-500">Pending Payments</p>
                <p className="text-xl font-bold">{stats.pendingPayments}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 rounded-2xl shadow-soft-lg bg-white">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg text-red-600">
                <ArrowUpTrayIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-500">Failed Payments</p>
                <p className="text-xl font-bold">{stats.failedPayments}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 rounded-2xl shadow-soft-lg bg-white">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <ChartBarIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-500">Success Rate</p>
                <p className="text-xl font-bold">{stats.successRate.toFixed(1)}%</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 rounded-2xl shadow-soft-lg bg-white">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <CurrencyDollarIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-500">Avg Payment</p>
                <p className="text-xl font-bold">${(stats.averagePayment / 100).toFixed(2)}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Trend Chart */}
          <Card className="p-6 rounded-2xl shadow-soft-lg bg-white lg:col-span-2">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Revenue Trend</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.revenueTrend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${(Number(value) / 100).toFixed(2)}`, 'Revenue']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    name="Revenue"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Provider Distribution */}
          <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Payment Providers</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.providerDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                     label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stats.providerDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Payments']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Status Distribution Chart */}
      {stats && (
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Payment Status Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.statusDistribution}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" name="Count">
                  {stats.statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Payments Table */}
      <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Recent Payments</h2>
          <div className="flex gap-2">
            <Select
              value={providerFilter}
              onChange={(e) => setProviderFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Providers' },
                { value: 'binance', label: 'Binance Pay' },
                { value: 'manual', label: 'Manual Crypto' }
              ]}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'SUCCESS', label: 'Success' },
                { value: 'PENDING', label: 'Pending' },
                { value: 'FAILED', label: 'Failed' },
                { value: 'CANCELED', label: 'Canceled' },
                { value: 'EXPIRED', label: 'Expired' }
              ]}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {payment.orderId.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    <div className="flex items-center">
                      <CreditCardIcon className="h-4 w-4 mr-2" />
                      {payment.provider}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    ${(payment.amountCents / 100).toFixed(2)} {payment.currency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === 'SUCCESS' ? 'bg-green-100 text-green-800' :
                      payment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      payment.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {payment.transactionId ? payment.transactionId.substring(0, 12) + '...' : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PaymentsDashboard;
