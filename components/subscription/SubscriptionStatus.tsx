// FILE: components/subscription/SubscriptionStatus.tsx
import React from 'react';
import { ClockIcon, CheckCircleIcon, XCircleIcon, ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
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

interface SubscriptionStatusProps {
  subscription: Subscription | null;
  onUpgrade?: () => void;
  onCancel?: () => void;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ 
  subscription, 
  onUpgrade,
  onCancel 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'CANCELED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'EXPIRED':
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (!subscription) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="text-center">
          <div className="mx-auto bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <XCircleIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
          <p className="text-gray-500 mb-6">
            You don't have an active subscription. Upgrade to access premium features.
          </p>
          <Button variant="primary" onClick={onUpgrade}>
            Subscribe Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Subscription Status</h3>
          <div className="flex items-center mt-1">
            {getStatusIcon(subscription.status)}
            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(subscription.status)}`}>
              {subscription.status}
            </span>
          </div>
        </div>
        
        {subscription.planType === 'YEARLY' && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Yearly Plan
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">Plan Type</span>
          <span className="text-sm text-gray-900">
            {subscription.planType === 'MONTHLY' ? 'Monthly' : 'Yearly'} 
            {subscription.planType === 'YEARLY' && ' ($4/month)'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">Start Date</span>
          <span className="text-sm text-gray-900">{formatDate(subscription.startDate)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">End Date</span>
          <span className="text-sm text-gray-900">{formatDate(subscription.endDate)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm font-medium text-gray-500">Auto-Renew</span>
          <span className="text-sm text-gray-900">
            {subscription.autoRenew ? (
              <span className="inline-flex items-center">
                <ArrowsRightLeftIcon className="h-4 w-4 text-green-500 mr-1" />
                Enabled
              </span>
            ) : (
              <span className="inline-flex items-center">
                <XCircleIcon className="h-4 w-4 text-gray-500 mr-1" />
                Disabled
              </span>
            )}
          </span>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200 flex flex-wrap gap-3">
        {!subscription.autoRenew && subscription.status === 'ACTIVE' && (
          <Button variant="outline" onClick={onUpgrade}>
            Enable Auto-Renew
          </Button>
        )}
        
        {subscription.autoRenew && subscription.status === 'ACTIVE' && (
          <Button variant="outline" onClick={onCancel}>
            Cancel Subscription
          </Button>
        )}
        
        {!subscription.autoRenew && subscription.status === 'ACTIVE' && (
          <Button variant="primary" onClick={onUpgrade}>
            Renew Now
          </Button>
        )}
      </div>
    </div>
  );
};

export default SubscriptionStatus;