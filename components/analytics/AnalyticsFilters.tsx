// FILE: components/analytics/AnalyticsFilters.tsx
import React, { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface FilterOption {
  label: string;
  value: string;
}

interface DateRange {
  start: string;
  end: string;
}

interface AnalyticsFiltersProps {
  onFilterChange: (filters: {
    dateRange: DateRange;
    timeGranularity: 'hourly' | 'daily' | 'weekly' | 'monthly';
    metrics: string[];
  }) => void;
  availableMetrics: FilterOption[];
  defaultMetrics: string[];
}

export default function AnalyticsFilters({ 
  onFilterChange, 
  availableMetrics, 
  defaultMetrics 
}: AnalyticsFiltersProps) {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  const [timeGranularity, setTimeGranularity] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(defaultMetrics);
  
  const handleApplyFilters = () => {
    onFilterChange({
      dateRange,
      timeGranularity,
      metrics: selectedMetrics
    });
  };
  
  const handleResetFilters = () => {
    setDateRange({
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    });
    setTimeGranularity('daily');
    setSelectedMetrics(defaultMetrics);
    onFilterChange({
      dateRange: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
      },
      timeGranularity: 'daily',
      metrics: defaultMetrics
    });
  };
  
  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric) 
        : [...prev, metric]
    );
  };

  return (
    <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
      <h3 className="text-lg font-medium text-slate-800 mb-4">Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-slate-700 mb-3">Date Range</h4>
          <div className="space-y-3">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 mb-1">
                Start Date
              </label>
              <Input
                id="startDate"
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 mb-1">
                End Date
              </label>
              <Input
                id="endDate"
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              />
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-slate-700 mb-3">Time Granularity</h4>
          <div className="space-y-3">
            {(['hourly', 'daily', 'weekly', 'monthly'] as const).map((granularity) => (
              <label key={granularity} className="flex items-center">
                <input
                  type="radio"
                  name="timeGranularity"
                  value={granularity}
                  checked={timeGranularity === granularity}
                  onChange={(e) => setTimeGranularity(e.target.value as any)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-3 text-slate-700 capitalize">{granularity}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="font-medium text-slate-700 mb-3">Metrics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {availableMetrics.map((metric) => (
              <label key={metric.value} className="flex items-center p-3 bg-slate-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedMetrics.includes(metric.value)}
                  onChange={() => toggleMetric(metric.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="ml-3 text-slate-700">{metric.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
        <Button variant="primary" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleResetFilters}>
          Reset Filters
        </Button>
      </div>
    </Card>
  );
}