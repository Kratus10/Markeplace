// FILE: components/subscription/PremiumContentWrapper.tsx
import React, { useEffect } from 'react';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import { LockClosedIcon } from '@heroicons/react/24/outline';

interface PremiumContentWrapperProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const PremiumContentWrapper: React.FC<PremiumContentWrapperProps> = ({ 
  children, 
  title = "Premium Content", 
  description = "This content is exclusively available to premium subscribers." 
}) => {
  const { isSubscribed, loading } = useSubscriptionStatus();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-full p-4">
              <LockClosedIcon className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-gray-600 mb-8">{description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-2xl mb-3">📈</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Trading Signals</h3>
              <p className="text-gray-600 text-sm">
                Real-time trading signals for major currency pairs and commodities
              </p>
            </Card>
            
            <Card className="p-6">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Analysis</h3>
              <p className="text-gray-600 text-sm">
                In-depth market analysis and technical insights from expert traders
              </p>
            </Card>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Subscription Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 border-2 border-blue-200">
                <h4 className="text-lg font-bold text-gray-900 mb-2">Monthly Plan</h4>
                <div className="text-3xl font-bold text-blue-600 mb-1">$5<span className="text-lg">/month</span></div>
                <p className="text-gray-600 text-sm mb-4">Billed monthly</p>
                <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
                  <li>✓ Real-time trading signals</li>
                  <li>✓ Market analysis reports</li>
                  <li>✓ Private messaging</li>
                  <li>✓ Community access</li>
                </ul>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => router.push('/subscribe?plan=monthly')}
                  className="w-full"
                >
                  Subscribe Now
                </Button>
              </Card>
              
              <Card className="p-6 border-2 border-purple-200 relative">
                <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  SAVE 20%
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Annual Plan</h4>
                <div className="text-3xl font-bold text-purple-600 mb-1">$4<span className="text-lg">/month</span></div>
                <p className="text-gray-600 text-sm mb-1">Billed annually ($48 total)</p>
                <p className="text-green-600 text-sm mb-3">Save $12 compared to monthly</p>
                <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
                  <li>✓ All Monthly features</li>
                  <li>✓ Priority support</li>
                  <li>✓ Exclusive webinars</li>
                  <li>✓ Advanced analytics</li>
                </ul>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => router.push('/subscribe?plan=yearly')}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Get Annual Plan
                </Button>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default PremiumContentWrapper;