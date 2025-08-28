// FILE: app/admin/analytics/dashboard/page.tsx
"use client";

import React, { useState } from "react";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, AreaChart, Area, PieChart, 
  Pie, Cell, ScatterChart, Scatter, ZAxis, RadarChart, Radar, 
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Treemap 
} from "recharts";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import MetricCard from "@/components/analytics/MetricCard";
import SimpleBarChart from "@/components/analytics/SimpleBarChart";
import SimpleLineChart from "@/components/analytics/SimpleLineChart";
import SimpleAreaChart from "@/components/analytics/SimpleAreaChart";
import SimplePieChart from "@/components/analytics/SimplePieChart";
import SimpleScatterPlot from "@/components/analytics/SimpleScatterPlot";
import SimpleRadarChart from "@/components/analytics/SimpleRadarChart";
import SimpleTreeMap from "@/components/analytics/SimpleTreeMap";
import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";

const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'funnel' | 'cohort'>('overview');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const { data: analyticsData, loading, error, refetch } = useDashboardAnalytics(timeRange);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h1>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-slate-200 rounded animate-pulse"></div>
          </div>
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
        
        <div className="card p-6 rounded-2xl shadow-soft-lg bg-white animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
          <div className="h-80 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h1>
        </div>
        
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <div className="text-center py-8">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Error Loading Analytics</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button variant="primary" onClick={refetch}>
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Use real data or fallback to mock data
  const kpiData = analyticsData?.kpis || [];
  const timeseriesData = analyticsData?.timeseries || [];
  const funnelData = analyticsData?.funnel || [];
  const cohortData = analyticsData?.cohort?.retention || [];
  const cohortLabels = analyticsData?.cohort?.labels || [];
  const productData = analyticsData?.topProducts || [];
  const trafficSources = analyticsData?.trafficSources || [];

  // Transform data for charts
  const transformedProductData = productData.map(item => ({
    product: item.product,
    revenue: parseFloat(item.revenue.replace(/[^0-9.-]+/g, "")),
    sales: item.sales
  }));

  const transformedGeographicData = [
    { country: "United States", visits: 8420, percentage: 23 },
    { country: "Germany", visits: 3210, percentage: 9 },
    { country: "United Kingdom", visits: 2870, percentage: 8 },
    { country: "France", visits: 2450, percentage: 7 },
    { country: "Canada", visits: 2100, percentage: 6 },
    { country: "Australia", visits: 1890, percentage: 5 },
    { country: "Japan", visits: 1680, percentage: 5 },
    { country: "Other", visits: 13600, percentage: 37 },
  ];

  const transformedDeviceData = [
    { device: "Desktop", visits: 19200, percentage: 52 },
    { device: "Mobile", visits: 13900, percentage: 38 },
    { device: "Tablet", visits: 3600, percentage: 10 },
  ];

  const transformedFeatureUsageData = [
    { feature: "Core Features", usage: 95 },
    { feature: "Advanced Features", usage: 68 },
    { feature: "Premium Features", usage: 42 },
    { feature: "Beta Features", usage: 18 },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h1>
        <div className="flex gap-2">
          <Button 
            variant={timeRange === '7d' ? 'primary' : 'outline'} 
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
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
          <Button variant="outline" onClick={refetch}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'overview'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'funnel'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveTab('funnel')}
        >
          Sales Funnel
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${
            activeTab === 'cohort'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
          onClick={() => setActiveTab('cohort')}
        >
          Cohort Analysis
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData.map((kpi, index) => (
              <MetricCard
                key={index}
                title={kpi.title}
                value={kpi.value}
                delta={kpi.delta}
                trend={kpi.delta >= 0 ? 'up' : 'down'}
              />
            ))}
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleLineChart
              data={timeseriesData}
              title="User Growth & Engagement"
              ariaLabel="Chart showing user growth and engagement trends over time"
              dataKeys={['date', 'users', 'topics', 'comments']}
              colors={['#3b82f6', '#10b981', '#8b5cf6']}
            />

            <SimpleBarChart
              data={transformedProductData}
              title="Category Performance"
              ariaLabel="Chart showing category performance by topics created"
              dataKey="sales"
              nameKey="product"
              color="#3b82f6"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimplePieChart
              data={trafficSources}
              title="Traffic Sources"
              ariaLabel="Pie chart showing traffic sources distribution"
              dataKey="percentage"
              nameKey="source"
              colors={COLORS}
            />

            <SimpleAreaChart
              data={timeseriesData}
              title="Engagement Trends"
              ariaLabel="Area chart showing engagement trends over time"
              dataKeys={['date', 'users', 'topics', 'comments']}
              colors={['#3b82f6', '#10b981', '#8b5cf6']}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SimpleScatterPlot
              data={transformedGeographicData}
              title="Geographic Distribution"
              ariaLabel="Scatter plot showing geographic distribution of users"
              xAxisKey="country"
              yAxisKey="visits"
              color="#3b82f6"
            />

            <SimpleRadarChart
              data={transformedFeatureUsageData}
              title="Feature Usage"
              ariaLabel="Radar chart showing feature usage rates"
              dataKey="usage"
              nameKey="feature"
              color="#3b82f6"
            />
          </div>

          <div className="grid grid-cols-1 gap-6">
            <SimpleTreeMap
              data={transformedDeviceData}
              title="Device Usage"
              ariaLabel="Tree map showing device usage distribution"
              dataKey="visits"
              nameKey="device"
              colors={COLORS}
            />
          </div>
        </div>
      )}

      {activeTab === 'funnel' && (
        <div className="space-y-8">
          <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">User Engagement Funnel</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={funnelData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  accessibilityLayer
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
                            <p className="font-medium text-slate-800">{label}</p>
                            <p className="text-sm text-slate-600">Users: {payload[0].value?.toLocaleString()}</p>
                            <p className="text-sm text-slate-600">Rate: {payload[0].payload.rate}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" name="Users" fill="#3b82f6">
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Funnel Steps</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Step</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Users</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Conversion Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Drop-off</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {funnelData.map((step, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{step.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{step.count.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{step.rate}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {index > 0 ? `${Math.round(100 - (step.count / funnelData[index-1].count * 100))}%` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'cohort' && (
        <div className="space-y-8">
          <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Cohort Retention Analysis</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cohortData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  accessibilityLayer
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cohort" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-lg">
                            <p className="font-medium text-slate-800">{label}</p>
                            {payload.map((entry, index) => (
                              <p key={index} style={{ color: entry.color }} className="text-sm">
                                {cohortLabels[parseInt(entry.dataKey?.toString().replace('periods[', '').replace(']', '') || '0')]}: {entry.value}%
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  {cohortLabels.map((label, index) => (
                    <Bar 
                      key={label} 
                      dataKey={`periods[${index}]`} 
                      name={label}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Retention Rates by Period</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cohort</th>
                    {cohortLabels.map((label, index) => (
                      <th key={index} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {cohortData.map((cohort, cohortIndex) => (
                    <tr key={cohortIndex}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{cohort.cohort}</td>
                      {cohort.periods.map((rate, periodIndex) => (
                        <td key={periodIndex} className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {rate}%
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
