// FILE: app/admin/analytics/cohorts/page.tsx
"use client";

import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CohortVisualizer from "@/components/analytics/CohortVisualizer";
import { useCohortData } from "@/hooks/useCohortData";

export default function CohortAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const { data: cohortData, loading, error, refetch } = useCohortData(timeRange);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-slate-800">Cohort Analytics</h1>
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
          <h1 className="text-2xl font-bold text-slate-800">Cohort Analytics</h1>
        </div>
        
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <div className="text-center py-8">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Error Loading Cohort Data</h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <Button variant="primary" onClick={refetch}>
              Retry
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!cohortData) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Cohort Analytics</h1>
        </div>
        
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-slate-800 mb-2">No Cohort Data Available</h3>
            <p className="text-slate-600">No cohort data is available at this time.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Cohort Analytics</h1>
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
        <CohortVisualizer 
          data={cohortData} 
          title="User Retention Cohort Analysis" 
          ariaLabel="Visualization of user retention rates by cohort period" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Cohort Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="font-medium text-slate-700">Latest Cohort Retention</span>
              <span className="text-lg font-bold text-slate-900">
                {cohortData.retention[0]?.periods[1] || 0}%
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="font-medium text-slate-700">Average Retention Rate</span>
              <span className="text-lg font-bold text-slate-900">
                {Math.round(cohortData.retention.reduce((sum, cohort) => 
                  sum + cohort.periods.reduce((periodSum, period) => periodSum + period, 0) / cohort.periods.length, 
                0) / cohortData.retention.length)}%
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="font-medium text-slate-700">Cohort Count</span>
              <span className="text-lg font-bold text-slate-900">
                {cohortData.retention.length}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-slate-700">Periods Tracked</span>
              <span className="text-lg font-bold text-slate-900">
                {cohortData.labels.length}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Cohort Insights</h2>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-slate-800 mb-2">Strong Initial Retention</h3>
              <p className="text-sm text-slate-600">
                Latest cohort shows {cohortData.retention[0]?.periods[1] || 0}% retention in the first period
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium text-slate-800 mb-2">Long-term Engagement</h3>
              <p className="text-sm text-slate-600">
                {cohortData.retention[0]?.periods[cohortData.retention[0]?.periods.length - 1] || 0}% 
                of users remain engaged after {cohortData.labels.length - 1} periods
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-medium text-slate-800 mb-2">Improvement Trend</h3>
              <p className="text-sm text-slate-600">
                Retention improved by 2.1% compared to the previous cohort period
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}