// FILE: hooks/useAnalytics.ts
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
  }>;
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

interface UseAnalyticsReturn {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAnalytics(): UseAnalyticsReturn {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/analytics');
      
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
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}