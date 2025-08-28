// FILE: app/premium/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import MessageList from '@/components/messages/MessageList';
import MessageComposer from '@/components/messages/MessageComposer';
import { toast } from 'sonner';

const PremiumContentPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubscription = async () => {
      if (status === 'loading') return;
      
      if (!session) {
        router.push('/auth/login');
        return;
      }

      try {
        const response = await fetch('/api/user/subscription');
        const result = await response.json();
        
        if (result.success) {
          setIsSubscribed(result.data.isSubscribed);
        }
      } catch (error) {
        console.error('Error checking subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSubscription();
  }, [session, status, router]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8">
            <div className="text-5xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Premium Content Access</h1>
            <p className="text-gray-600 mb-6">
              This content is exclusively available to subscribers. Upgrade to a premium subscription to access trading signals, advanced market analysis, and private messaging with other traders.
            </p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => router.push('/subscribe')}
            >
              Subscribe Now
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Premium Trading Content</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="text-3xl mb-3">📈</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Trading Signals</h3>
            <p className="text-gray-600 text-sm mb-4">
              Real-time trading signals for major currency pairs and commodities.
            </p>
            <Button variant="outline" size="sm">
              View Signals
            </Button>
          </Card>
          
          <Card className="p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Market Analysis</h3>
            <p className="text-gray-600 text-sm mb-4">
              In-depth market analysis and technical insights from expert traders.
            </p>
            <Button variant="outline" size="sm">
              Read Analysis
            </Button>
          </Card>
          
          <Card className="p-6">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Private Community</h3>
            <p className="text-gray-600 text-sm mb-4">
              Connect with other premium subscribers in our exclusive trading community.
            </p>
            <Button variant="outline" size="sm">
              Join Community
            </Button>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Premium Messages */}
          <Card className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Premium Messages</h2>
              <p className="text-sm text-gray-500">
                Exclusive messages from expert traders
              </p>
            </div>
            <div className="flex-1 overflow-y-auto max-h-96">
              <MessageList 
                userId={session?.user.id || ''} 
                isPremiumUser={isSubscribed} 
              />
            </div>
          </Card>
          
          {/* Trading Signals */}
          <Card className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Latest Trading Signals</h2>
              <p className="text-sm text-gray-500">
              </p>
            </div>
            <div className="flex-1 overflow-y-auto max-h-96">
              <div className="p-4 space-y-4">
                <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                  <div className="flex justify-between">
                    <span className="font-medium">EUR/USD</span>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-green-700">BUY at 1.0850, TP: 1.0900, SL: 1.0800</p>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                  <div className="flex justify-between">
                    <span className="font-medium">GBP/USD</span>
                    <span className="text-sm text-gray-500">4 hours ago</span>
                  </div>
                  <p className="text-red-700">SELL at 1.2700, TP: 1.2650, SL: 1.2750</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                  <div className="flex justify-between">
                    <span className="font-medium">Gold</span>
                    <span className="text-sm text-gray-500">6 hours ago</span>
                  </div>
                  <p className="text-blue-700">BUY at $2350, TP: $2400, SL: $2300</p>
                </div>
                
                <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50">
                  <div className="flex justify-between">
                    <span className="font-medium">Bitcoin</span>
                    <span className="text-sm text-gray-500">1 day ago</span>
                  </div>
                  <p className="text-purple-700">BUY at $62000, TP: $65000, SL: $60000</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PremiumContentPage;