'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Pagination from '@/components/ui/Pagination';
import { 
  CloudArrowDownIcon, 
  EyeIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowPathIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';

interface QuarantineFile {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'pending' | 'scanning' | 'clean' | 'infected' | 'error';
  uploadedAt: string;
  scanResult: string;
}

const QuarantineManagement: React.FC = () => {
  const { data: session } = useSession();
  const [quarantineFiles, setQuarantineFiles] = useState<QuarantineFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(10);
  const [selectedFile, setSelectedFile] = useState<QuarantineFile | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [statuses] = useState(['pending', 'scanning', 'clean', 'infected', 'error']);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockFiles: QuarantineFile[] = [
      {
        id: '1',
        name: 'expert_advisor.mq5',
        type: 'MQ5',
        size: '2.4 MB',
        status: 'clean',
        uploadedAt: '2023-05-15 14:30:00',
        scanResult: 'No threats detected'
      },
      {
        id: '2',
        name: 'indicator_script.mq5',
        type: 'MQ5',
        size: '1.1 MB',
        status: 'pending',
        uploadedAt: '2023-05-16 09:15:00',
        scanResult: 'Awaiting scan'
      },
      {
        id: '3',
        name: 'trading_strategy.mq5',
        type: 'MQ5',
        size: '3.7 MB',
        status: 'infected',
        uploadedAt: '2023-05-16 11:45:00',
        scanResult: 'Malware detected'
      }
    ];
    
    setQuarantineFiles(mockFiles);
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return 'bg-green-100 text-green-800';
      case 'infected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'scanning': return 'bg-blue-100 text-blue-800';
      case 'error': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter files based on search term and filters
  const filteredFiles = quarantineFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filters.status ? file.status === filters.status : true;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = filteredFiles.slice(indexOfFirstFile, indexOfLastFile);
  const totalPages = Math.ceil(filteredFiles.length / filesPerPage);

  const handlePreview = (file: QuarantineFile) => {
    setSelectedFile(file);
    setIsPreviewModalOpen(true);
  };

  const handleApprove = (file: QuarantineFile) => {
    setSelectedFile(file);
    setIsApproveModalOpen(true);
  };

  const handleReject = (file: QuarantineFile) => {
    setSelectedFile(file);
    setIsRejectModalOpen(true);
  };

  const approveFile = async () => {
    if (!selectedFile) return;
    
    try {
      // In a real app, this would be an API call
      setQuarantineFiles(prev => 
        prev.map(file => 
          file.id === selectedFile.id 
            ? { ...file, status: 'clean' } 
            : file
        )
      );
      
      toast.success('File approved successfully');
      setIsApproveModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error approving file:', error);
      toast.error('Failed to approve file');
    }
  };

  const rejectFile = async () => {
    if (!selectedFile) return;
    
    try {
      // In a real app, this would be an API call
      setQuarantineFiles(prev => 
        prev.filter(file => file.id !== selectedFile.id)
      );
      
      toast.success('File rejected successfully');
      setIsRejectModalOpen(false);
      setSelectedFile(null);
    } catch (error) {
      console.error('Error rejecting file:', error);
      toast.error('Failed to reject file');
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

  // Check if user is admin - use optional chaining and provide fallback
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
        <h1 className="text-2xl font-bold">Quarantine Management</h1>
        <p className="text-sm text-gray-500">{quarantineFiles.length} files in quarantine</p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Search Files"
              placeholder="Search by file name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<EyeIcon className="h-4 w-4" />}
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

      {/* Files Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="bg-gray-200 border-2 border-dashed rounded w-8 h-8 flex items-center justify-center">
                        <CloudArrowDownIcon className="h-4 w-4" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{file.name}</div>
                        <div className="text-sm text-gray-500">{file.scanResult}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(file.status)}`}>
                      {file.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{file.uploadedAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mr-2 text-blue-600 hover:text-blue-900"
                      onClick={() => handlePreview(file)}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" /> Preview
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mr-2 text-green-600 hover:text-green-900"
                      onClick={() => handleApprove(file)}
                      disabled={file.status === 'infected' || file.status === 'error'}
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleReject(file)}
                    >
                      <XCircleIcon className="h-4 w-4 mr-1" /> Reject
                    </Button>
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
                Showing <span className="font-medium">{indexOfFirstFile + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastFile, filteredFiles.length)}</span> of{' '}
                <span className="font-medium">{filteredFiles.length}</span> results
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

        {filteredFiles.length === 0 && (
          <div className="px-6 py-12 text-center">
            <CloudArrowDownIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No files found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </Card>

      {/* Preview Modal */}
      <Modal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} title="File Preview">
        {selectedFile && (
          <div>
            <div className="flex items-center mb-4">
              <div className="bg-gray-200 border-2 border-dashed rounded w-12 h-12 flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">{selectedFile.name}</h3>
                <p className="text-sm text-gray-500">{selectedFile.type} • {selectedFile.size}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Scan Results</h4>
              <p className="text-sm text-gray-600">{selectedFile.scanResult}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Status</h4>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedFile.status)}`}>
                {selectedFile.status.charAt(0).toUpperCase() + selectedFile.status.slice(1)}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Approve Modal */}
      <Modal isOpen={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)} title="Approve File">
        {selectedFile && (
          <div>
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                Are you sure you want to approve the file <span className="font-medium">{selectedFile.name}</span>?
                This will move the file from quarantine to the production environment.
              </p>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setIsApproveModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={approveFile}>
                  Approve File
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Reject File">
        {selectedFile && (
          <div>
            <div className="mb-4">
              <p className="text-gray-600 mb-4">
                Are you sure you want to reject the file <span className="font-medium">{selectedFile.name}</span>?
                This will permanently delete the file from the quarantine.
              </p>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={rejectFile}>
                  Reject File
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default QuarantineManagement;
