// FILE: app/admin/analytics/funnel/page.tsx
"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import FunnelVisualizer from "@/components/analytics/FunnelVisualizer";
import { useFunnelData } from "@/hooks/useFunnelData";

export default function FunnelAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const { data: funnelData, loading, error, refetch } = useFunnelData(timeRange);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Sales Funnel Analytics</h1>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-slate-200 rounded animate-pulse"></div>
          </div>
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
          <h1 className="text-2xl font-bold text-slate-800">Sales Funnel Analytics</h1>
        </div>
        
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <div className="text-center py-8">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Error Loading Funnel Data</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button variant="primary" onClick={refetch}>
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!funnelData) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Sales Funnel Analytics</h1>
        </div>
        
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-slate-800 mb-2">No Funnel Data Available</h3>
            <p className="text-slate-600">No funnel data is available at this time.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Sales Funnel Analytics</h1>
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

      <div className="grid grid-cols-1 gap-6 mb-8">
        <FunnelVisualizer 
          steps={funnelData} 
          title="Sales Funnel Visualization" 
          ariaLabel="Visualization of the sales funnel showing conversion rates at each stage" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Funnel Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="font-medium text-slate-700">Overall Conversion Rate</span>
              <span className="text-lg font-bold text-slate-900">
                {funnelData[funnelData.length - 1]?.rate || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="font-medium text-slate-700">Total Visitors</span>
              <span className="text-lg font-bold text-slate-900">
                {funnelData[0]?.count.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="font-medium text-slate-700">Converted Visitors</span>
              <span className="text-lg font-bold text-slate-900">
                {funnelData[funnelData.length - 1]?.count.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-slate-700">Average Drop-off Rate</span>
              <span className="text-lg font-bold text-slate-900">
                {Math.round(funnelData.reduce((sum, step, index) => {
                  if (index === 0) return sum;
                  const dropOff = 100 - step.rate;
                  return sum + dropOff;
                }, 0) / (funnelData.length - 1))}%
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Funnel Insights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-slate-800 mb-2">Primary Drop-off Point</h3>
              <p className="text-sm text-slate-600">
                The largest drop-off occurs between Signups and Checkout ({Math.round(100 - (funnelData[2]?.count / funnelData[1]?.count * 100) || 0)}%)
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-slate-800 mb-2">Optimization Opportunity</h3>
              <p className="text-sm text-slate-600">
                Improving the checkout flow could increase overall conversion by up to 3.2%
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-slate-800 mb-2">Repeat Purchase Rate</h3>
              <p className="text-sm text-slate-600">
                {funnelData[4]?.rate || 0}% of initial visitors make repeat purchases
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}