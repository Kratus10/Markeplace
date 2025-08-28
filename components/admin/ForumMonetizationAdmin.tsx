'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface UserEngagement {
  id: string;
  name: string;
  email: string;
  kycVerified: boolean;
  totalLikes: number;
  totalReplies: number;
  totalEarnings: number;
  pendingPayout: number;
  fraudScore: number;
  status: 'ACTIVE' | 'HELD_FOR_REVIEW' | 'PAID';
}

const ForumMonetizationAdmin = () => {
  const [engagementData, setEngagementData] = useState<UserEngagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // Mock data for demonstration
    const mockData: UserEngagement[] = [
      {
        id: '1',
        name: 'TraderPro',
        email: 'trader@example.com',
        kycVerified: true,
        totalLikes: 1250,
        totalReplies: 89,
        totalEarnings: 12.75,
        pendingPayout: 12.75,
        fraudScore: 5,
        status: 'ACTIVE'
      },
      {
        id: '2',
        name: 'MarketGuru',
        email: 'guru@example.com',
        kycVerified: true,
        totalLikes: 890,
        totalReplies: 156,
        totalEarnings: 10.20,
        pendingPayout: 10.20,
        fraudScore: 12,
        status: 'HELD_FOR_REVIEW'
      },
      {
        id: '3',
        name: 'NoviceTrader',
        email: 'novice@example.com',
        kycVerified: false,
        totalLikes: 420,
        totalReplies: 32,
        totalEarnings: 0,
        pendingPayout: 0,
        fraudScore: 75,
        status: 'ACTIVE'
      }
    ];
    
    setEngagementData(mockData);
    setLoading(false);
  }, [timeRange]);

  const handlePayout = (userId: string) => {
    // In a real implementation, this would trigger a payout
    console.log(`Processing payout for user ${userId}`);
    alert(`Payout processing initiated for user ${userId}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return <div className="p-6">Loading engagement data...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Forum Monetization Dashboard</h1>
        <div className="flex gap-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="secondary">Export CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card variant="outline">
          <div className="p-6">
            <p className="text-sm text-gray-500">Total Earnings</p>
            <p className="text-2xl font-bold mt-2">$22.95</p>
          </div>
        </Card>
        
        <Card variant="outline">
          <div className="p-6">
            <p className="text-sm text-gray-500">Pending Payouts</p>
            <p className="text-2xl font-bold mt-2">$22.95</p>
          </div>
        </Card>
        
        <Card variant="outline">
          <div className="p-6">
            <p className="text-sm text-gray-500">KYC Verified Users</p>
            <p className="text-2xl font-bold mt-2">2</p>
          </div>
        </Card>
        
        <Card variant="outline">
          <div className="p-6">
            <p className="text-sm text-gray-500">Flagged Accounts</p>
            <p className="text-2xl font-bold mt-2">1</p>
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Engagement & Earnings</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Likes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Replies</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fraud Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {engagementData.map((user) => (
                  <tr key={user.id} className={user.fraudScore > 50 ? 'bg-red-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.kycVerified ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Verified
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.totalLikes.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.totalReplies.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {formatCurrency(user.totalEarnings)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {formatCurrency(user.pendingPayout)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${user.fraudScore > 50 ? 'text-red-600' : user.fraudScore > 20 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {user.fraudScore}
                        </span>
                        {user.fraudScore > 50 && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            High Risk
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                        user.status === 'HELD_FOR_REVIEW' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user.kycVerified && user.pendingPayout > 0 && (
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handlePayout(user.id)}
                          disabled={user.status === 'PAID'}
                        >
                          {user.status === 'PAID' ? 'Paid' : 'Process Payout'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payout Instructions</h2>
            <div className="prose max-w-none">
              <ol>
                <li>Review flagged accounts with high fraud scores before processing payouts</li>
                <li>Only process payouts for KYC-verified users</li>
                <li>Minimum payout threshold is $10.00</li>
                <li>Bi-monthly payouts are processed on the 1st and 15th of each month</li>
                <li>Generate signed CSV for audit purposes before executing transfers</li>
              </ol>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Monetization Rules</h2>
            <div className="prose max-w-none">
              <ul>
                <li>$0.50 per 1,000 likes on posts</li>
                <li>$0.50 per 200 replies on posts</li>
                <li>$0.50 per 1,000 likes on comments</li>
                <li>$0.50 per 200 replies on comments</li>
                <li>Only KYC-verified users are eligible for payouts</li>
                <li>Accounts with fraud scores above 50 are automatically flagged</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForumMonetizationAdmin;