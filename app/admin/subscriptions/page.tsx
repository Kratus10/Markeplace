// FILE: app/admin/subscriptions/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  UserGroupIcon, 
  CalendarIcon, 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface Subscription {
  id: string;
  userId: string;
  user: {
    name: string | null;
    email: string | null;
  };
  planType: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  createdAt: string;
}

interface SubscriptionStats {
  totalSubscribers: number;
  monthlySubscribers: number;
  yearlySubscribers: number;
  churnRate: number;
  revenue: number;
  growthRate: number;
  averageRevenuePerUser: number;
  subscriberTrend: Array<{
    date: string;
    count: number;
  }>;
  planDistribution: Array<{
    name: string;
    value: number;
  }>;
  statusDistribution: Array<{
    name: string;
    value: number;
  }>;
}

const SubscriptionsDashboard = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [statusFilter, setStatusFilter] = useState('all');

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/subscriptions?timeRange=${timeRange}`);
      const result = await response.json();
      
      if (result.success) {
        setSubscriptions(result.data.subscriptions);
        setStats(result.data.stats);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [timeRange]);

  const handleExport = async (format: string) => {
    try {
      const response = await fetch(`/api/admin/subscriptions/export?format=${format}&timeRange=${timeRange}`);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscriptions-report-${new Date().toISOString().split('T')[0]}.${format === 'csv' ? 'csv' : 'xlsx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting subscriptions:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Subscription Management</h1>
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
        <h1 className="text-2xl font-bold text-slate-800">Subscription Management</h1>
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
          <Button variant="outline" onClick={fetchSubscriptions}>
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
                <UserGroupIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-500">Total Subscribers</p>
                <p className="text-xl font-bold">{stats.totalSubscribers}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 rounded-2xl shadow-soft-lg bg-white">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <CurrencyDollarIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-500">Monthly Revenue</p>
                <p className="text-xl font-bold">${(stats.revenue / 100).toFixed(2)}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 rounded-2xl shadow-soft-lg bg-white">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <CalendarIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-500">Churn Rate</p>
                <p className="text-xl font-bold">{stats.churnRate.toFixed(1)}%</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 rounded-2xl shadow-soft-lg bg-white">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
                <ArrowTrendingUpIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-500">Growth Rate</p>
                <p className="text-xl font-bold">+{stats.growthRate.toFixed(1)}%</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 rounded-2xl shadow-soft-lg bg-white">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <ChartBarIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-500">Avg Revenue/User</p>
                <p className="text-xl font-bold">${stats.averageRevenuePerUser.toFixed(2)}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4 rounded-2xl shadow-soft-lg bg-white">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg text-red-600">
                <UserGroupIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-slate-500">Monthly Plans</p>
                <p className="text-xl font-bold">{stats.monthlySubscribers}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Subscriber Trend Chart */}
          <Card className="p-6 rounded-2xl shadow-soft-lg bg-white lg:col-span-2">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Subscriber Growth</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.subscriberTrend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value, 'Subscribers']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                    name="Subscribers"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          
          {/* Plan Distribution Chart */}
          <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Plan Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.planDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {stats.planDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Subscribers']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Status Distribution Chart */}
      {stats && (
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white mb-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Subscription Status Distribution</h2>
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

      {/* Subscriptions Table */}
      <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Active Subscriptions</h2>
          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'ACTIVE', label: 'Active' },
                { value: 'CANCELLED', label: 'Cancelled' },
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
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Auto-Renew
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {subscriptions.map((subscription) => (
                <tr key={subscription.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-900">
                      {subscription.user.name || subscription.user.email}
                    </div>
                    <div className="text-sm text-slate-500">
                      {subscription.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {subscription.planType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      subscription.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      subscription.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {subscription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {subscription.autoRenew ? 'Yes' : 'No'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
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

export default SubscriptionsDashboard;
