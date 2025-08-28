'use client';

import { useState, useEffect, useCallback } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { toast } from 'sonner';

interface SitemapStatus {
  lastGenerated: string | null;
  indexedPages: number;
  lastPing: string | null;
  jobStatus: 'idle' | 'running' | 'error';
}

export default function SeoDashboardClient() {
  const [status, setStatus] = useState<SitemapStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const response = await fetch('/api/seo/sitemap-status');
      if (!response.ok) {
        throw new Error('Failed to fetch sitemap status');
      }
      const data = await response.json();
      setStatus(data);
      if (data.jobStatus === 'running') {
        setTimeout(fetchStatus, 5000); // Poll every 5 seconds
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error('Could not load sitemap data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    toast.info('Sitemap regeneration started...');
    try {
      const response = await fetch('/api/admin/seo/sitemap/regenerate', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to start sitemap regeneration');
      }
      toast.success('Sitemap regeneration initiated successfully!');
      setTimeout(fetchStatus, 2000); // Start polling sooner
    } catch (error) {
      console.error(error);
      toast.error('Failed to start sitemap regeneration.');
    } finally {
      setIsRegenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 bg-red-100 border border-red-400 rounded-lg p-4">
          <p className="font-bold">Error loading SEO Dashboard</p>
          <p>{error}</p>
          <Button onClick={() => { setIsLoading(true); setError(null); fetchStatus(); }} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SEO Dashboard</h1>
        <div className="flex space-x-4">
          <Button variant="outline">View Docs</Button>
          <Button onClick={handleRegenerate} disabled={isRegenerating || status?.jobStatus === 'running'}>
            {isRegenerating || status?.jobStatus === 'running' ? 'Regenerating...' : 'Regenerate Sitemap'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-200 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Last Sitemap Generated</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{status?.lastGenerated ? new Date(status.lastGenerated).toLocaleString() : 'N/A'}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Status: <span className={status?.jobStatus === 'running' ? 'text-yellow-500' : 'text-green-500'}>{status?.jobStatus || 'idle'}</span>
          </p>
        </Card>

        <Card className="bg-green-50 border-green-200 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Indexed Pages</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{status?.indexedPages.toLocaleString() || 0}</div>
          <p className="text-xs text-muted-foreground">
            Across all sitemaps
          </p>
        </Card>

        <Card className="bg-purple-50 border-purple-200 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium">Last Search Engine Ping</h3>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="text-2xl font-bold">{status?.lastPing ? new Date(status.lastPing).toLocaleString() : 'N/A'}</div>
          <p className="text-xs text-muted-foreground">
            Google, Bing, and others
          </p>
        </Card>
      </div>
    </div>
  );
}
