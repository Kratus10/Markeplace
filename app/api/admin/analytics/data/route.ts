// FILE: app/api/admin/analytics/data/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

// Mock data - in a real implementation, this would query your database
const mockAnalyticsData = {
  kpis: {
    totalUsers: 12483,
    activeUsers: 8342,
    revenue: 42198,
    conversionRate: 4.8,
  },
  timeseries: [
    { date: "2024-01-01", users: 8230, revenue: 28450, sessions: 12420 },
    { date: "2024-01-08", users: 8742, revenue: 31200, sessions: 13870 },
    { date: "2024-01-15", users: 9120, revenue: 34500, sessions: 14560 },
    { date: "2024-01-22", users: 9870, revenue: 38200, sessions: 15230 },
    { date: "2024-01-29", users: 10320, revenue: 41800, sessions: 16870 },
    { date: "2024-02-05", users: 10890, revenue: 42600, sessions: 16230 },
    { date: "2024-02-12", users: 11420, revenue: 43100, sessions: 17560 },
    { date: "2024-02-19", users: 11870, revenue: 44200, sessions: 18230 },
    { date: "2024-02-26", users: 12483, revenue: 45800, sessions: 18870 },
  ],
  funnel: [
    { name: "Visits", count: 15420, rate: 100 },
    { name: "Signups", count: 3210, rate: 20.8 },
    { name: "Checkout", count: 1420, rate: 9.2 },
    { name: "Purchases", count: 842, rate: 5.5 },
    { name: "Repeat Purchases", count: 215, rate: 1.4 },
  ],
  cohort: {
    retention: [
      { cohort: "Jan 2024", periods: [100, 78, 65, 52, 43, 35, 28] },
      { cohort: "Dec 2023", periods: [100, 72, 58, 46, 38, 31, 25] },
      { cohort: "Nov 2023", periods: [100, 68, 52, 41, 34, 27, 22] },
      { cohort: "Oct 2023", periods: [100, 65, 48, 38, 31, 25, 20] },
    ],
    labels: ["Period 0", "Period 1", "Period 2", "Period 3", "Period 4", "Period 5", "Period 6"],
  },
  topProducts: [
    { name: "Product A", sales: 1242, revenue: 12420 },
    { name: "Product B", sales: 987, revenue: 9870 },
    { name: "Product C", sales: 756, revenue: 7560 },
    { name: "Product D", sales: 632, revenue: 6320 },
  ],
  trafficSources: [
    { source: "Direct", percentage: 42 },
    { source: "Social Media", percentage: 28 },
    { source: "Search Engines", percentage: 18 },
    { source: "Referrals", percentage: 12 },
  ]
};

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and has admin role
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('timeRange') || '30d';
    
    // In a real implementation, you would filter data based on the timeRange
    // For now, we'll return mock data
    
    return NextResponse.json({
      success: true,
      data: mockAnalyticsData
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' }, 
      { status: 500 }
    );
  }
}