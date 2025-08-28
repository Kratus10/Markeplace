'use client';

import React, { useState } from 'react';
import { ArrowPathIcon, EyeIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';

// Mock data for demonstration
const webhookEvents = [
  { id: '1', eventType: 'payment.success', status: 'success', timestamp: '2025-08-20 14:30:22', payload: '{"orderId": "ORD-12345", "amount": 49.99}' },
  { id: '2', eventType: 'quarantine.scan', status: 'failed', timestamp: '2025-08-19 09:15:44', payload: '{"fileId": "FILE-67890", "scanResult": "clean"}' },
  { id: '3', eventType: 'user.created', status: 'success', timestamp: '2025-08-18 16:45:10', payload: '{"userId": "USR-54321", "email": "user@example.com"}' },
  { id: '4', eventType: 'subscription.updated', status: 'pending', timestamp: '2025-08-17 11:30:55', payload: '{"subscriptionId": "SUB-09876", "status": "active"}' },
  { id: '5', eventType: 'product.published', status: 'success', timestamp: '2025-08-16 08:20:33', payload: '{"productId": "PROD-11223", "status": "published"}' },
];

const statuses = ['success', 'failed', 'pending'];
const eventTypes = ['payment.success', 'quarantine.scan', 'user.created', 'subscription.updated', 'product.published'];

const WebhookManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: '', eventType: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isPayloadModalOpen, setIsPayloadModalOpen] = useState(false);
  
  const itemsPerPage = 5;
  
  // Filter events based on search and filters
  const filteredEvents = webhookEvents.filter(event => {
    const matchesSearch = event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filters.status ? event.status === filters.status : true;
    const matchesEventType = filters.eventType ? event.eventType === filters.eventType : true;
    
    return matchesSearch && matchesStatus && matchesEventType;
  });
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const handlePreviewPayload = (event: any) => {
    setSelectedEvent(event);
    setIsPayloadModalOpen(true);
  };

  const replayWebhook = (eventId: string) => {
    // In a real app, API call to replay webhook
    console.log(`Replaying webhook: ${eventId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Webhook Management</h1>
        <p className="text-sm text-gray-500">{webhookEvents.length} webhook events</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Search Webhooks"
              placeholder="Search by event type or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={[
                { value: '', label: 'All Statuses' },
                ...statuses.map(status => ({ value: status, label: status.charAt(0).toUpperCase() + status.slice(1) }))
              ]}
            />
          </div>
          <div>
            <Select
              label="Event Type"
              value={filters.eventType}
              onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
              options={[
                { value: '', label: 'All Event Types' },
                ...eventTypes.map(type => ({ value: type, label: type }))
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Webhook Events Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{event.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.eventType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mr-2 text-blue-600 hover:text-blue-900"
                      onClick={() => handlePreviewPayload(event)}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" /> View
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-green-600 hover:text-green-900"
                      onClick={() => replayWebhook(event.id)}
                      disabled={event.status === 'success'}
                    >
                      <ArrowPathIcon className="h-4 w-4 mr-1" /> Replay
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredEvents.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={setCurrentPage} 
            />
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">No webhook events found matching your filters</p>
          </div>
        )}
      </Card>

      {/* Payload Preview Modal */}
      <Modal
        isOpen={isPayloadModalOpen}
        onClose={() => setIsPayloadModalOpen(false)}
        title="Webhook Payload"
        size="lg"
      >
        {selectedEvent && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-900">Event #{selectedEvent.id}</h3>
              <p className="text-sm text-gray-500">Type: {selectedEvent.eventType} | Status: <span className={`px-1.5 py-0.5 rounded ${getStatusColor(selectedEvent.status)}`}>{selectedEvent.status}</span></p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto max-h-80">
                {JSON.stringify(JSON.parse(selectedEvent.payload), null, 2)}
              </pre>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={() => setIsPayloadModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default WebhookManagementPage;
