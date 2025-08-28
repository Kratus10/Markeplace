import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data - replace with actual logic to get sitemap status
  const mockStatus = {
    lastGenerated: new Date().toISOString(),
    indexedPages: 1234,
    lastPing: new Date().toISOString(),
    jobStatus: 'idle' as 'idle' | 'running' | 'error',
  };

  return NextResponse.json(mockStatus);
}