'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card, { CardHeader, CardContent } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { UserCircleIcon, PaperAirplaneIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
}

interface Message {
  id: string;
  content: string;
  readAt: string | null;
  createdAt: string;
  sender: User;
  receiver: User;
}

const MessagesPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState({
    receiverId: '',
    content: ''
  });
  const [users, setUsers] = useState<User[]>([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchMessages();
      fetchUsers();
    }
  }, [status, router]);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data.messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // In a real app, this would fetch premium users
      // For now, we'll just use a placeholder
      const response = await fetch('/api/users/premium');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMessage(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();
      setMessages(prev => [data.message, ...prev]);
      setNewMessage({
        receiverId: '',
        content: ''
      });
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error((error as Error).message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch('/api/messages/mark-as-read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }

      const data = await response.json();
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, readAt: data.message.readAt } : msg
        )
      );
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark message as read');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <ArrowPathIcon className="h-8 w-8 animate-spin mx-auto text-blue-500" />
        <p className="mt-2">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <Button onClick={fetchMessages} variant="outline">
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* New Message Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="px-6 py-4 bg-gray-50">
              <h3 className="text-lg font-medium">Send New Message</h3>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="receiverId" className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient
                  </label>
                  <select
                    id="receiverId"
                    name="receiverId"
                    value={newMessage.receiverId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a recipient</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={newMessage.content}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full flex items-center justify-center"
                  disabled={sending}
                >
                  <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                  {sending ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Messages List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="px-6 py-4 bg-gray-50">
              <h3 className="text-lg font-medium">Your Messages</h3>
            </CardHeader>
            <CardContent className="p-0">
              {messages.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <UserCircleIcon className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="mt-2">No messages yet</p>
                  <p className="text-sm">Send a message to start a conversation</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {messages.map(message => (
                    <li 
                      key={message.id} 
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${!message.readAt && message.receiver.id === session?.user?.id ? 'bg-blue-50' : ''}`}
                      onClick={() => message.receiver.id === session?.user?.id && !message.readAt && markAsRead(message.id)}
                    >
                      <div className="flex items-start">
                        {message.sender.avatar ? (
                          <img 
                            src={message.sender.avatar} 
                            alt={message.sender.name || 'User'} 
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        )}
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">
                              {message.sender.id === session?.user?.id 
                                ? `To: ${message.receiver.name || message.receiver.email}` 
                                : message.sender.name || message.sender.email}
                            </h4>
                            <p className="text-xs text-gray-500">
                              {formatDate(message.createdAt)}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-700">
                            {message.content}
                          </p>
                          {message.receiver.id === session?.user?.id && !message.readAt && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                              Unread
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;