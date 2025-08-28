// FILE: app/admin/analytics/sales/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

interface SalesData {
  revenue: Array<{
    month: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
  conversion: Array<{
    stage: string;
    count: number;
    rate: number;
  }>;
  products: Array<{
    product: string;
    revenue: number;
    unitsSold: number;
    profitMargin: number;
  }>;
  regions: Array<{
    region: string;
    sales: number;
    growth: number;
  }>;
}

export default function SalesAnalytics() {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d');
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      // Mock data - in a real implementation, this would come from an API
      const mockData: SalesData = {
        revenue: [
          { month: 'Jan', revenue: 42198, orders: 842, customers: 12483 },
          { month: 'Feb', revenue: 45800, orders: 923, customers: 13870 },
          { month: 'Mar', revenue: 48200, orders: 987, customers: 14560 },
          { month: 'Apr', revenue: 51600, orders: 1056, customers: 15230 },
          { month: 'May', revenue: 54200, orders: 1124, customers: 16870 },
          { month: 'Jun', revenue: 52800, orders: 1087, customers: 16230 },
        ],
        conversion: [
          { stage: 'Visits', count: 15420, rate: 100 },
          { stage: 'Signups', count: 3210, rate: 20.8 },
          { stage: 'Checkout', count: 1420, rate: 9.2 },
          { stage: 'Purchases', count: 842, rate: 5.5 },
          { stage: 'Repeat Purchases', count: 215, rate: 1.4 },
        ],
        products: [
          { product: 'Product A', revenue: 12420, unitsSold: 1242, profitMargin: 32 },
          { product: 'Product B', revenue: 9870, unitsSold: 987, profitMargin: 28 },
          { product: 'Product C', revenue: 7560, unitsSold: 756, profitMargin: 35 },
          { product: 'Product D', revenue: 6320, unitsSold: 632, profitMargin: 25 },
          { product: 'Product E', revenue: 4200, unitsSold: 420, profitMargin: 40 },
        ],
        regions: [
          { region: 'North America', sales: 22450, growth: 12.4 },
          { region: 'Europe', sales: 15680, growth: 8.2 },
          { region: 'Asia Pacific', sales: 18920, growth: 15.7 },
          { region: 'Latin America', sales: 8760, growth: 5.3 },
          { region: 'Africa', sales: 4580, growth: 2.1 },
        ]
      };
      
      setSalesData(mockData);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Sales Analytics</h1>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
      </div>
    );
  }

  if (!salesData) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Sales Analytics</h1>
        </div>
        
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-slate-800 mb-2">No Sales Data Available</h3>
            <p className="text-slate-600">Unable to load sales analytics data at this time.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Sales Analytics</h1>
        <div className="flex gap-2">
          <Button 
            variant={timeRange === '30d' ? 'primary' : 'outline'} 
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </Button>
          <Button 
            variant={timeRange === '90d' ? 'primary' : 'outline'} 
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </Button>
          <Button 
            variant={timeRange === '1y' ? 'primary' : 'outline'} 
            onClick={() => setTimeRange('1y')}
          >
            1 Year
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h3 className="text-lg font-medium text-slate-800 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-slate-900">
            ${salesData.revenue.reduce((sum, month) => sum + month.revenue, 0).toLocaleString()}
          </p>
          <p className="text-sm text-green-600 mt-1">+15.7% from last period</p>
        </Card>
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h3 className="text-lg font-medium text-slate-800 mb-2">Orders</h3>
          <p className="text-3xl font-bold text-slate-900">
            {salesData.revenue.reduce((sum, month) => sum + month.orders, 0).toLocaleString()}
          </p>
          <p className="text-sm text-green-600 mt-1">+8.2% from last period</p>
        </Card>
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h3 className="text-lg font-medium text-slate-800 mb-2">Conversion Rate</h3>
          <p className="text-3xl font-bold text-slate-900">
            {salesData.conversion[salesData.conversion.length - 1]?.rate || 0}%
          </p>
          <p className="text-sm text-red-600 mt-1">-2.1% from last period</p>
        </Card>
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h3 className="text-lg font-medium text-slate-800 mb-2">Avg. Order Value</h3>
          <p className="text-3xl font-bold text-slate-900">
            ${(salesData.revenue.reduce((sum, month) => sum + month.revenue, 0) / 
              salesData.revenue.reduce((sum, month) => sum + month.orders, 0)).toFixed(2)}
          </p>
          <p className="text-sm text-green-600 mt-1">+3.4% from last period</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Revenue Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData.revenue}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
                          <p className="font-medium text-slate-800">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={index} style={{ color: entry.color }} className="text-sm">
                              {entry.dataKey}: {entry.value?.toLocaleString()}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Area 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey="revenue" 
                  stackId="1" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  name="Revenue ($)" 
                />
                <Area 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="orders" 
                  stackId="2" 
                  stroke="#10b981" 
                  fill="#10b981" 
                  name="Orders" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Sales Funnel</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData.conversion}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stage" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Users" fill="#3b82f6" />
                <Bar dataKey="rate" name="Conversion Rate (%)" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Product Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData.products}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" name="Revenue ($)" fill="#3b82f6" />
                <Bar dataKey="unitsSold" name="Units Sold" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Regional Sales</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesData.regions}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="sales"
                  nameKey="region"
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {salesData.regions.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
        <h3 className="text-lg font-medium text-slate-800 mb-4">Sales Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-slate-800 mb-2">Top Performing Product</h4>
            <p className="text-sm text-slate-600">
              Product A generated ${salesData.products[0]?.revenue.toLocaleString() || 0} in revenue (23% of total)
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-medium text-slate-800 mb-2">Best Conversion Channel</h4>
            <p className="text-sm text-slate-600">
              Email campaigns have a 12.4% conversion rate
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-medium text-slate-800 mb-2">Seasonal Trend</h4>
            <p className="text-sm text-slate-600">
              Sales peak during holiday seasons (+28% increase)
            </p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-slate-800 mb-2">Customer Lifetime Value</h4>
            <p className="text-sm text-slate-600">
              Avg. CLV is $342, with repeat customers spending 3.2x more
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
