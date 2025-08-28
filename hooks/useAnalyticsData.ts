// FILE: hooks/useAnalyticsData.ts
import { useState, useEffect } from 'react';

interface AnalyticsData {
  kpis: {
    totalUsers: number;
    activeUsers: number;
    revenue: number;
    conversionRate: number;
  };
  timeseries: Array<{
    date: string;
    users: number;
    revenue: number;
    sessions: number;
  }>;
  funnel: Array<{
    name: string;
    count: number;
    rate: number;
  }>;
  cohort: {
    retention: Array<{
      cohort: string;
      periods: number[];
    }>;
    labels: string[];
  };
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  trafficSources: Array<{
    source: string;
    percentage: number;
  }>;
}

interface UseAnalyticsDataReturn {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAnalyticsData(timeRange: string = '30d'): UseAnalyticsDataReturn {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/analytics/data?timeRange=${timeRange}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch analytics data');
      }
      
      setData(result.data);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
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