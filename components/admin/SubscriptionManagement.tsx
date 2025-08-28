// FILE: components/admin/SubscriptionManagement.tsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';

interface SubscriptionStat {
  id: string;
  name: string;
  value: number;
}

interface SubscriptionTrend {
  date: string;
  newSubscriptions: number;
  cancellations: number;
  revenue: number;
}

interface SubscriptionPlanDistribution {
  name: string;
  value: number;
}

const SubscriptionManagement: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [stats, setStats] = useState<SubscriptionStat[]>([]);
  const [trends, setTrends] = useState<SubscriptionTrend[]>([]);
  const [planDistribution, setPlanDistribution] = useState<SubscriptionPlanDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, this would fetch from an API
      // For now, we'll use mock data
      
      // Mock stats
      const mockStats = [
        { id: 'total', name: 'Total Subscribers', value: 1248 },
        { id: 'active', name: 'Active Subscribers', value: 1156 },
        { id: 'monthly', name: 'Monthly Plan', value: 724 },
        { id: 'yearly', name: 'Yearly Plan', value: 432 },
        { id: 'churn', name: 'Churn Rate', value: 7.2 },
        { id: 'mrr', name: 'Monthly Recurring Revenue', value: 5240 },
        { id: 'arr', name: 'Annual Recurring Revenue', value: 62880 },
      ];
      
      // Mock trends
      const mockTrends = [
        { date: '2025-08-01', newSubscriptions: 24, cancellations: 3, revenue: 1200 },
        { date: '2025-08-08', newSubscriptions: 32, cancellations: 5, revenue: 1600 },
        { date: '2025-08-15', newSubscriptions: 28, cancellations: 2, revenue: 1400 },
        { date: '2025-08-22', newSubscriptions: 35, cancellations: 4, revenue: 1750 },
        { date: '2025-08-29', newSubscriptions: 42, cancellations: 3, revenue: 2100 },
      ];
      
      // Mock plan distribution
      const mockPlanDistribution = [
        { name: 'Monthly', value: 724 },
        { name: 'Yearly', value: 432 },
      ];
      
      setStats(mockStats);
      setTrends(mockTrends);
      setPlanDistribution(mockPlanDistribution);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, [timeRange]);

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-80 bg-gray-200 rounded"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.id} className="p-6 rounded-2xl shadow-soft-lg bg-white">
            <h3 className="text-sm font-medium text-slate-500 mb-2">{stat.name}</h3>
            <p className="text-3xl font-bold text-slate-900">{stat.value}{stat.id === 'churn' ? '%' : stat.id === 'mrr' || stat.id === 'arr' ? '$' : ''}</p>
          </Card>
        ))}
      </div>
      
      {/* Controls */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">Subscription Analytics</h2>
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
          <Button variant="outline" onClick={fetchSubscriptionData}>
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Trends */}
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Subscription Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="newSubscriptions" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                  name="New Subscriptions"
                />
                <Line 
                  type="monotone" 
                  dataKey="cancellations" 
                  stroke="#ef4444" 
                  name="Cancellations"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        
        {/* Revenue Trends */}
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={trends}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Bar 
                  dataKey="revenue" 
                  fill="#10b981" 
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      {/* Plan Distribution */}
      <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Subscription Plan Distribution</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={planDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {planDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [value, 'Subscribers']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default SubscriptionManagement;