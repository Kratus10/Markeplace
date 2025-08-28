// FILE: hooks/useFunnelData.ts
import { useState, useEffect } from 'react';

interface FunnelStep {
  name: string;
  count: number;
  rate: number;
}

interface UseFunnelDataReturn {
  data: FunnelStep[] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFunnelData(timeRange: string = '30d'): UseFunnelDataReturn {
  const [data, setData] = useState<FunnelStep[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/analytics/funnel?timeRange=${timeRange}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch funnel data');
      }
      
      setData(result.data);
    } catch (err) {
      console.error('Error fetching funnel data:', err);
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