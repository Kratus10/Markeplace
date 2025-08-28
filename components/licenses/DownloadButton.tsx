'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';

export default function DownloadButton({ licenseId }: { licenseId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/licenses/${licenseId}/download`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to request download');
      }
      
      const { presignedUrl } = await response.json();
      
      // Open the presigned URL in a new tab to trigger download
      window.open(presignedUrl, '_blank');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      {loading ? 'Preparing Download...' : 'Download Product'}
    </Button>
  );
}
