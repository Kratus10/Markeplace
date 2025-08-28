// FILE: hooks/useSubscriptionStatus.ts
import { useState, useEffect } from 'react';

interface Subscription {
  id: string;
  planType: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  createdAt: string;
}

export function useSubscriptionStatus() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptionStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/user/subscription-status');
      const result = await response.json();
      
      if (result.success) {
        setIsSubscribed(result.data.isSubscribed);
        setSubscription(result.data.subscription);
      } else {
        setError(result.error || 'Failed to fetch subscription status');
      }
    } catch (err) {
      console.error('Error fetching subscription status:', err);
      setError('Failed to fetch subscription status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionStatus();
  }, []);

  return {
    isSubscribed,
    subscription,
    loading,
    error,
    refetch: fetchSubscriptionStatus
  };
}