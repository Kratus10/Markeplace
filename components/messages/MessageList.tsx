// FILE: components/messages/MessageList.tsx
import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
  content: string;
  isPremium: boolean;
  readAt: Date | null;
  createdAt: Date;
}

interface MessageListProps {
  userId: string;
  isPremiumUser: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ userId, isPremiumUser }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/messages?isPremium=${showPremiumOnly}`);
      const result = await response.json();
      
      if (result.success) {
        setMessages(result.data.messages);
      } else {
        toast.error(result.error || 'Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [showPremiumOnly]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="p-4">
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-full h-10 w-10"></div>
                <div className="ml-3">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      {isPremiumUser && (
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="premium-filter"
            checked={showPremiumOnly}
            onChange={(e) => setShowPremiumOnly(e.target.checked)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="premium-filter" className="ml-2 text-sm text-gray-700">
            Show Premium Messages Only
          </label>
        </div>
      )}
      
      {messages.length === 0 ? (
        <Card className="text-center py-8">
          <p className="text-gray-500">
            {showPremiumOnly 
              ? 'No premium messages found.' 
              : 'No messages yet. Send a message to start a conversation.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id} className="hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {message.sender.image ? (
                      <img 
                        src={message.sender.image} 
                        alt={message.sender.name || 'User'} 
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-full w-10 h-10 flex items-center justify-center">
                        <span className="text-gray-500 text-xs">
                          {message.sender.name?.charAt(0) || message.sender.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-1">
                    <div className="flex items-baseline">
                      <h4 className="text-sm font-medium text-gray-900">
                        {message.sender.name || message.sender.email}
                      </h4>
                      <span className="ml-2 text-xs text-gray-500">
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </span>
                      {message.isPremium && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                          Premium
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-1 text-sm text-gray-700">
                      {message.content}
                    </div>
                    
                    {!message.readAt && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Unread
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageList;