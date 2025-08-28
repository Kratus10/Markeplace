// FILE: components/subscription/SubscribeForm.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';

interface Subscription {
  id: string;
  planType: string;
  status: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  createdAt: string;
}

interface SubscribeFormProps {
  subscription: Subscription | null;
}

const SubscribeForm: React.FC<SubscribeFormProps> = ({ subscription }) => {
  const router = useRouter();

  const handleRenew = () => {
    // Redirect to payment page for renewal
    window.location.href = '/payment';
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel auto-renew for your subscription?')) {
      return;
    }

    try {
      const response = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Subscription auto-renew has been canceled!');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      toast.error('Failed to cancel subscription');
    }
  };

  return (
    <div className="space-y-4">
      {subscription && subscription.status === 'ACTIVE' && subscription.autoRenew && (
        <Button
          variant="outline"
          onClick={handleCancel}
          className="w-full"
        >
          Cancel Auto-Renew
        </Button>
      )}

      {subscription && subscription.status === 'ACTIVE' && !subscription.autoRenew && (
        <>
          <Button
            variant="primary"
            onClick={handleRenew}
            className="w-full"
          >
            Renew Subscription
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="w-full"
          >
            Disable Auto-Renew
          </Button>
        </>
      )}
    </div>
  );
};

export default SubscribeForm;