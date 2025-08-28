'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Pagination from '@/components/ui/Pagination';
import { UserIcon, DocumentTextIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface DataRequest {
  id: string;
  userId: string;
  userEmail: string;
  type: 'data_export' | 'account_deletion';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  completedAt: string | null;
}

const GdprRequestsPage: React.FC = () => {
  const { data: session } = useSession();
  const [dataRequests, setDataRequests] = useState<DataRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage] = useState(10);
  const [requestTypes] = useState(['data_export', 'account_deletion']);
  const [statuses] = useState(['pending', 'processing', 'completed', 'failed']);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockRequests: DataRequest[] = [
      {
        id: '1',
        userId: 'user1',
        userEmail: 'user1@example.com',
        type: 'data_export',
        status: 'completed',
        requestedAt: '2023-05-15 10:30:00',
        completedAt: '2023-05-15 11:15:00'
      },
      {
        id: '2',
        userId: 'user2',
        userEmail: 'user2@example.com',
        type: 'account_deletion',
        status: 'pending',
        requestedAt: '2023-05-16 14:20:00',
        completedAt: null
      },
      {
        id: '3',
        userId: 'user3',
        userEmail: 'user3@example.com',
        type: 'data_export',
        status: 'processing',
        requestedAt: '2023-05-16 09:45:00',
        completedAt: null
      }
    ];
    
    setDataRequests(mockRequests);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'data_export': return 'Data Export';
      case 'account_deletion': return 'Account Deletion';
      default: return type;
    }
  };

  // Filter requests based on search term and filters
  const filteredRequests = dataRequests.filter(request => {
    const matchesSearch = request.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          request.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filters.type ? request.type === filters.type : true;
    const matchesStatus = filters.status ? request.status === filters.status : true;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);

  const handleProcessRequest = async (requestId: string) => {
    try {
      // In a real app, this would be an API call
      setDataRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: 'processing' } 
            : request
        )
      );
      
      toast.success('Request processing started');
    } catch (error) {
      console.error('Error processing request:', error);
      toast.error('Failed to process request');
    }
  };

  const handleCompleteRequest = async (requestId: string) => {
    try {
      // In a real app, this would be an API call
      setDataRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: 'completed', completedAt: new Date().toISOString() } 
            : request
        )
      );
      
      toast.success('Request completed successfully');
    } catch (error) {
      console.error('Error completing request:', error);
      toast.error('Failed to complete request');
    }
  };

  if (!session) {
    return (
      <div className="p-6">
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <div className="text-center py-8">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Access Denied</h3>
            <p className="text-slate-600">You need to be logged in to access this page.</p>
          </div>
        </Card>
      </div>
    );
  }

  // Check if user is admin
  const isAdmin = session.user?.role === 'ADMIN_L1' ||
                  session.user?.role === 'ADMIN_L2' ||
                  session.user?.role === 'OWNER';

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card className="p-6 rounded-2xl shadow-soft-lg bg-white">
          <div className="text-center py-8">
            <div className="text-red-500 text-2xl mb-2">⚠️</div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">Access Denied</h3>
            <p className="text-slate-600">You don't have permission to access this page.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">GDPR Data Requests</h1>
        <p className="text-sm text-gray-500">{dataRequests.length} pending requests</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Search Requests"
              placeholder="Search by user ID or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select
              label="Request Type"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              options={[
                { value: '', label: 'All Types' },
                ...requestTypes.map(type => ({ 
                  value: type, 
                  label: getTypeLabel(type) 
                }))
              ]}
            />
          </div>
          <div>
            <Select
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={[
                { value: '', label: 'All Statuses' },
                ...statuses.map(status => ({ 
                  value: status, 
                  label: status.charAt(0).toUpperCase() + status.slice(1) 
                }))
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Requests Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center">
                        <UserIcon className="h-4 w-4" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{request.userEmail}</div>
                        <div className="text-sm text-gray-500">ID: {request.userId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getTypeLabel(request.type)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(request.requestedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {request.status === 'pending' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-blue-600 hover:text-blue-900"
                        onClick={() => handleProcessRequest(request.id)}
                      >
                        <ClockIcon className="h-4 w-4 mr-1" /> Process
                      </Button>
                    )}
                    {request.status === 'processing' && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-green-600 hover:text-green-900"
                        onClick={() => handleCompleteRequest(request.id)}
                      >
                        <CheckCircleIcon className="h-4 w-4 mr-1" /> Complete
                      </Button>
                    )}
                    {(request.status === 'completed' || request.status === 'failed') && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-600 hover:text-gray-900"
                        disabled
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-1" /> View
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstRequest + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastRequest, filteredRequests.length)}</span> of{' '}
                <span className="font-medium">{filteredRequests.length}</span> results
              </p>
            </div>
            <div>
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={setCurrentPage} 
              />
            </div>
          </div>
        </div>

        {filteredRequests.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No GDPR requests found matching your filters</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default GdprRequestsPage;
