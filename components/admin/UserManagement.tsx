// FILE: components/admin/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  subscriptions: Subscription[];
  orders: Order[];
  topics: Topic[];
  comments: Comment[];
}

interface Subscription {
  id: string;
  planType: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface Order {
  id: string;
  productId: string;
  status: string;
  createdAt: string;
}

interface Topic {
  id: string;
  title: string;
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/admin/users?page=${pagination.page}&limit=${pagination.limit}`
      );
      
      const result = await response.json();
      
      if (result.success) {
        setUsers(result.data.users);
        setPagination(result.data.pagination);
      } else {
        console.error('Failed to fetch users:', result.error);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pagination.page]);

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'bg-purple-100 text-purple-800';
      case 'ADMIN_L1':
        return 'bg-blue-100 text-blue-800';
      case 'ADMIN_L2':
        return 'bg-indigo-100 text-indigo-800';
      case 'USER':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubscriptionStatusClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'CANCELED':
        return 'bg-red-100 text-red-800';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="bg-white rounded-2xl shadow-soft-lg p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded"></div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <Card className="rounded-2xl shadow-soft-lg bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Registration Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Subscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Subscription Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Products Bought
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Forum Activities
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {users.map((user) => {
                    const latestSubscription = user.subscriptions[0] || null;
                    const productsBought = user.orders.filter(order => order.status === 'PAID').length;
                    const forumActivities = user.topics.length + user.comments.length;
                    
                    return (
                      <tr key={user.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-slate-900">
                            {user.name || 'N/A'}
                          </div>
                          <div className="text-sm text-slate-500">
                            {user.email || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {latestSubscription ? (
                            <div>
                              <div>{latestSubscription.planType}</div>
                              <div className="text-xs">
                                {formatDate(latestSubscription.startDate)} - {formatDate(latestSubscription.endDate)}
                              </div>
                            </div>
                          ) : (
                            'No subscription'
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {latestSubscription ? (
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSubscriptionStatusClass(latestSubscription.status)}`}>
                              {latestSubscription.status}
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              None
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {productsBought}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {forumActivities} activities
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-700">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {
                Math.min(pagination.page * pagination.limit, pagination.total)
              } of {pagination.total} users
            </div>
            
            <Pagination 
              currentPage={pagination.page} 
              totalPages={pagination.pages} 
              onPageChange={handlePageChange} 
            />
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;