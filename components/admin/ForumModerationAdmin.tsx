'use client';

import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ThumbsUp, MessageCircle, Eye, ShieldAlert } from 'lucide-react';

interface ReportedContent {
  id: string;
  type: 'topic' | 'comment';
  title: string;
  content: string;
  author: string;
  authorId: string;
  createdAt: string;
  reports: number;
  status: 'VISIBLE' | 'HIDDEN_BY_AI' | 'HIDDEN_BY_MOD' | 'QUARANTINED';
  likes: number;
  comments: number;
  views: number;
}

const ForumModerationAdmin = () => {
  const [reportedContent, setReportedContent] = useState<ReportedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // In a real implementation, this would fetch from an API
    // Mock data for demonstration
    const mockData: ReportedContent[] = [
      {
        id: '1',
        type: 'comment',
        title: 'Comment on Market Analysis',
        content: 'This is inappropriate content that violates our guidelines...',
        author: 'User123',
        authorId: 'user123',
        createdAt: '2023-05-15T10:30:00Z',
        reports: 5,
        status: 'VISIBLE',
        likes: 12,
        comments: 0,
        views: 0
      },
      {
        id: '2',
        type: 'topic',
        title: 'Trading Strategy Discussion',
        content: 'Suspicious trading advice that might be misleading...',
        author: 'TraderPro',
        authorId: 'traderpro',
        createdAt: '2023-05-14T14:22:00Z',
        reports: 3,
        status: 'HIDDEN_BY_AI',
        likes: 24,
        comments: 8,
        views: 120
      }
    ];
    
    setReportedContent(mockData);
    setLoading(false);
  }, [filter]);

  const handleHideContent = (id: string) => {
    // In a real implementation, this would call an API
    console.log(`Hiding content ${id}`);
    alert(`Content hidden and author notified`);
  };

  const handleQuarantineContent = (id: string) => {
    // In a real implementation, this would call an API
    console.log(`Quarantining content ${id}`);
    alert(`Content quarantined for review`);
  };

  const handleApproveContent = (id: string) => {
    // In a real implementation, this would call an API
    console.log(`Approving content ${id}`);
    alert(`Content approved and restored`);
  };

  if (loading) {
    return <div className="p-6">Loading reported content...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Forum Content Moderation</h1>
        <div className="flex gap-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Content</option>
            <option value="topics">Topics Only</option>
            <option value="comments">Comments Only</option>
            <option value="ai_flagged">AI Flagged</option>
            <option value="user_reported">User Reported</option>
          </select>
          <Button variant="secondary">Refresh</Button>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Reported Content</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reports</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportedContent.map((content) => (
                  <tr key={content.id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{content.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{content.content}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(content.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {content.author}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        content.type === 'topic' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {content.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center text-red-600">
                        <ShieldAlert size={16} className="mr-1" />
                        {content.reports}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        <span className="flex items-center">
                          <Eye size={16} className="mr-1" />
                          {content.views}
                        </span>
                        <span className="flex items-center">
                          <ThumbsUp size={16} className="mr-1" />
                          {content.likes}
                        </span>
                        {content.type === 'topic' && (
                          <span className="flex items-center">
                            <MessageCircle size={16} className="mr-1" />
                            {content.comments}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        content.status === 'VISIBLE' ? 'bg-green-100 text-green-800' :
                        content.status === 'HIDDEN_BY_AI' ? 'bg-yellow-100 text-yellow-800' :
                        content.status === 'HIDDEN_BY_MOD' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {content.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {(content.status === 'VISIBLE' || content.status === 'HIDDEN_BY_AI') && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleHideContent(content.id)}
                          >
                            Hide
                          </Button>
                        )}
                        {content.status === 'VISIBLE' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleQuarantineContent(content.id)}
                          >
                            Quarantine
                          </Button>
                        )}
                        {(content.status === 'HIDDEN_BY_AI' || content.status === 'HIDDEN_BY_MOD' || content.status === 'QUARANTINED') && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApproveContent(content.id)}
                          >
                            Approve
                          </Button>
                        )}
                      </div>
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
            <h2 className="text-xl font-semibold mb-4">Moderation Guidelines</h2>
            <div className="prose max-w-none">
              <ul>
                <li>Content hidden by AI should be reviewed within 24 hours</li>
                <li>Content with 3+ reports requires moderator attention</li>
                <li>Quarantined content requires OWNER approval to restore</li>
                <li>All moderation actions are logged for audit purposes</li>
                <li>Authors should be notified of content moderation actions</li>
              </ul>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">AI Moderation Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confidence Threshold
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="80" 
                  className="w-full"
                />
                <div className="text-sm text-gray-500">80% - Content below this threshold requires human review</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-hide Threshold
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  defaultValue="95" 
                  className="w-full"
                />
                <div className="text-sm text-gray-500">95% - Content above this threshold is automatically hidden</div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Enable AI Moderation</span>
                <Button variant="primary" size="sm">Enabled</Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForumModerationAdmin;