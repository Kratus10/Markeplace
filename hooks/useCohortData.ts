// FILE: hooks/useCohortData.ts
import { useState, useEffect } from 'react';

interface CohortData {
  retention: Array<{
    cohort: string;
    periods: number[];
  }>;
  labels: string[];
}

interface UseCohortDataReturn {
  data: CohortData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useCohortData(timeRange: string = '30d'): UseCohortDataReturn {
  const [data, setData] = useState<CohortData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/analytics/cohorts?timeRange=${timeRange}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch cohort data');
      }
      
      setData(result.data);
    } catch (err) {
      console.error('Error fetching cohort data:', err);
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