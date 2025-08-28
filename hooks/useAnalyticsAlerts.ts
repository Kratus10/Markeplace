// FILE: hooks/useAnalyticsAlerts.ts
import { useState, useEffect } from 'react';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  acknowledged: boolean;
}

interface UseAnalyticsAlertsReturn {
  alerts: Alert[];
  loading: boolean;
  error: string | null;
  fetchAlerts: (filter?: 'all' | 'unacknowledged') => Promise<void>;
  acknowledgeAlert: (alertId: string) => Promise<void>;
}

export function useAnalyticsAlerts(): UseAnalyticsAlertsReturn {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async (filter: 'all' | 'unacknowledged' = 'all') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/admin/analytics/alerts?filter=${filter}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch alerts');
      }
      
      setAlerts(result.data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const response = await fetch('/api/admin/analytics/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alertId }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to acknowledge alert');
      }
      
      // Update the local state to mark the alert as acknowledged
      setAlerts(alerts.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ));
      
      console.log(result.message);
    } catch (err) {
      console.error('Error acknowledging alert:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      throw err;
    }
  };

  useEffect(() => {
    fetchAlerts('unacknowledged');
  }, []);

  return {
    alerts,
    loading,
    error,
    fetchAlerts,
    acknowledgeAlert
  };
}