// FILE: hooks/useDashboardAnalytics.ts
import { useState, useEffect } from 'react';

interface KpiData {
  title: string;
  value: string | number;
  delta: number;
}

interface TimeseriesDataPoint {
  date: string;
  users: number;
  topics: number;
  comments: number;
  [key: string]: string | number;
}

interface FunnelStep {
  name: string;
  count: number;
  rate: number;
}

interface CohortData {
  retention: Array<{
    cohort: string;
    periods: number[];
  }>;
  labels: string[];
}

interface ProductData {
  product: string;
  sales: number;
  revenue: string;
}

interface TrafficSource {
  source: string;
  percentage: number;
}

interface DashboardAnalyticsData {
  kpis: KpiData[];
  timeseries: TimeseriesDataPoint[];
  funnel: FunnelStep[];
  cohort: CohortData;
  topProducts: ProductData[];
  trafficSources: TrafficSource[];
}

interface UseDashboardAnalyticsReturn {
  data: DashboardAnalyticsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardAnalytics(timeRange: string = '30d'): UseDashboardAnalyticsReturn {
  const [data, setData] = useState<DashboardAnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/analytics/dashboard?timeRange=${timeRange}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch dashboard analytics data');
      }
      
      setData(result.data);
    } catch (err) {
      console.error('Error fetching dashboard analytics data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}