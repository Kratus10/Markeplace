// FILE: components/signals/TradingSignalsPage.tsx
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { LockClosedIcon, ChartBarIcon, LightBulbIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface TradingSignal {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  entry: number;
  takeProfit: number;
  stopLoss: number;
  confidence: number;
  timestamp: string;
  description: string;
}

const TradingSignalsPage: React.FC = () => {
  const { data: session } = useSession();
  const { isSubscribed, loading: subscriptionLoading } = useSubscriptionStatus();
  const router = useRouter();
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSignals = async () => {
      if (!session) return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/signals');
        const result = await response.json();
        
        if (result.success) {
          setSignals(result.data.signals);
        } else {
          toast.error(result.error || 'Failed to fetch signals');
        }
      } catch (error) {
        console.error('Error fetching signals:', error);
        toast.error('Failed to fetch signals');
      } finally {
        setLoading(false);
      }
    };

    if (session && isSubscribed) {
      fetchSignals();
    } else {
      setLoading(false);
    }
  }, [session, isSubscribed]);

  if (subscriptionLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isSubscribed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <Card className="p-8">
          <div className="text-6xl mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Exclusive Trading Signals</h1>
          <p className="text-gray-600 mb-2 text-lg">
            Access professional trading signals and market insights
          </p>
          <p className="text-gray-500 mb-8">
            This content is exclusively available to premium subscribers. Upgrade to access real-time trading signals, advanced market analysis, and expert insights.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-2xl mb-3">📈</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Signals</h3>
              <p className="text-gray-600 text-sm">
                Get live trading signals for major currency pairs and commodities
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
          
          <p className="text-gray-500 text-sm">
            Already subscribed? <button 
              onClick={() => router.push('/auth/login')} 
              className="text-blue-600 hover:underline"
            >
              Log in
            </button> to access your signals
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trading Signals</h1>
          <p className="text-gray-600 mt-2">Real-time signals from our expert trading team</p>
        </div>
        <div className="mt-4 md:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Live Updates
          </span>
        </div>
      </div>
      
      {signals.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Signals Available</h3>
          <p className="text-gray-600 mb-6">Our trading team is analyzing the markets. New signals will be published soon.</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signals.map((signal) => (
            <Card key={signal.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className={`p-4 ${signal.action === 'BUY' ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold">{signal.symbol}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    signal.action === 'BUY' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {signal.action}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Confidence: {signal.confidence}%
                </div>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entry:</span>
                    <span className="font-medium">{signal.entry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">Take Profit:</span>
                    <span className="font-medium text-green-600">{signal.takeProfit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">Stop Loss:</span>
                    <span className="font-medium text-red-600">{signal.stopLoss}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600">{signal.description}</p>
                  <div className="mt-3 text-xs text-gray-500">
                    {new Date(signal.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-8 text-center">
        <Card className="p-6 inline-block max-w-2xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Private Messaging</h3>
          <p className="text-gray-600 mb-4">
            Connect with other premium subscribers and our trading experts for personalized insights.
          </p>
          <Button 
            variant="primary" 
            onClick={() => router.push('/messages')}
          >
            Open Messages
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default TradingSignalsPage;