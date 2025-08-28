// FILE: app/api/admin/analytics/timeseries/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

// Mock data - in a real implementation, this would query your database
const mockTimeseriesData = [
  { date: "2024-01-01", users: 8230, revenue: 28450 },
  { date: "2024-01-08", users: 8742, revenue: 31200 },
  { date: "2024-01-15", users: 9120, revenue: 34500 },
  { date: "2024-01-22", users: 9870, revenue: 38200 },
  { date: "2024-01-29", users: 10320, revenue: 41800 },
  { date: "2024-02-05", users: 10890, revenue: 42600 },
  { date: "2024-02-12", users: 11420, revenue: 43100 },
  { date: "2024-02-19", users: 11870, revenue: 44200 },
  { date: "2024-02-26", users: 12483, revenue: 45800 },
];

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and has admin role
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // In a real implementation, you would fetch data from your database here
    // For now, we'll return mock data
    
    return NextResponse.json({
      success: true,
      data: mockTimeseriesData
    });
  } catch (error) {
    console.error('Timeseries API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeseries data' }, 
      { status: 500 }
    );
  }
}