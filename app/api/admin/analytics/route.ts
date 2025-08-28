// FILE: app/api/admin/analytics/route.ts
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
    { date: "2024-01-01", users: 8230, revenue: 28450 },
    { date: "2024-01-08", users: 8742, revenue: 31200 },
    { date: "2024-01-15", users: 9120, revenue: 34500 },
    { date: "2024-01-22", users: 9870, revenue: 38200 },
    { date: "2024-01-29", users: 10320, revenue: 41800 },
    { date: "2024-02-05", users: 10890, revenue: 42600 },
    { date: "2024-02-12", users: 11420, revenue: 43100 },
    { date: "2024-02-19", users: 11870, revenue: 44200 },
    { date: "2024-02-26", users: 12483, revenue: 45800 },
  ],
  funnel: [
    { name: "Visits", count: 15420, rate: 100 },
    { name: "Signups", count: 3210, rate: 20.8 },
    { name: "Checkout", count: 1420, rate: 9.2 },
    { name: "Purchases", count: 842, rate: 5.5 },
    { name: "Repeat Purchases", count: 215, rate: 1.4 },
  ],
  heatmap: [
    { hour: 0, day: 'Mon', value: 120 }, { hour: 1, day: 'Mon', value: 90 }, { hour: 2, day: 'Mon', value: 60 },
    { hour: 3, day: 'Mon', value: 45 }, { hour: 4, day: 'Mon', value: 30 }, { hour: 5, day: 'Mon', value: 40 },
    { hour: 6, day: 'Mon', value: 65 }, { hour: 7, day: 'Mon', value: 110 }, { hour: 8, day: 'Mon', value: 220 },
    { hour: 9, day: 'Mon', value: 340 }, { hour: 10, day: 'Mon', value: 420 }, { hour: 11, day: 'Mon', value: 480 },
    { hour: 12, day: 'Mon', value: 510 }, { hour: 13, day: 'Mon', value: 490 }, { hour: 14, day: 'Mon', value: 460 },
    { hour: 15, day: 'Mon', value: 520 }, { hour: 16, day: 'Mon', value: 610 }, { hour: 17, day: 'Mon', value: 720 },
    { hour: 18, day: 'Mon', value: 810 }, { hour: 19, day: 'Mon', value: 780 }, { hour: 20, day: 'Mon', value: 690 },
    { hour: 21, day: 'Mon', value: 580 }, { hour: 22, day: 'Mon', value: 420 }, { hour: 23, day: 'Mon', value: 280 },
    
    { hour: 0, day: 'Tue', value: 110 }, { hour: 1, day: 'Tue', value: 85 }, { hour: 2, day: 'Tue', value: 55 },
    { hour: 3, day: 'Tue', value: 40 }, { hour: 4, day: 'Tue', value: 25 }, { hour: 5, day: 'Tue', value: 35 },
    { hour: 6, day: 'Tue', value: 60 }, { hour: 7, day: 'Tue', value: 105 }, { hour: 8, day: 'Tue', value: 210 },
    { hour: 9, day: 'Tue', value: 330 }, { hour: 10, day: 'Tue', value: 410 }, { hour: 11, day: 'Tue', value: 470 },
    { hour: 12, day: 'Tue', value: 500 }, { hour: 13, day: 'Tue', value: 480 }, { hour: 14, day: 'Tue', value: 450 },
    { hour: 15, day: 'Tue', value: 510 }, { hour: 16, day: 'Tue', value: 600 }, { hour: 17, day: 'Tue', value: 710 },
    { hour: 18, day: 'Tue', value: 800 }, { hour: 19, day: 'Tue', value: 770 }, { hour: 20, day: 'Tue', value: 680 },
    { hour: 21, day: 'Tue', value: 570 }, { hour: 22, day: 'Tue', value: 410 }, { hour: 23, day: 'Tue', value: 270 },
    
    { hour: 0, day: 'Wed', value: 105 }, { hour: 1, day: 'Wed', value: 80 }, { hour: 2, day: 'Wed', value: 50 },
    { hour: 3, day: 'Wed', value: 35 }, { hour: 4, day: 'Wed', value: 20 }, { hour: 5, day: 'Wed', value: 30 },
    { hour: 6, day: 'Wed', value: 55 }, { hour: 7, day: 'Wed', value: 100 }, { hour: 8, day: 'Wed', value: 200 },
    { hour: 9, day: 'Wed', value: 320 }, { hour: 10, day: 'Wed', value: 400 }, { hour: 11, day: 'Wed', value: 460 },
    { hour: 12, day: 'Wed', value: 490 }, { hour: 13, day: 'Wed', value: 470 }, { hour: 14, day: 'Wed', value: 440 },
    { hour: 15, day: 'Wed', value: 500 }, { hour: 16, day: 'Wed', value: 590 }, { hour: 17, day: 'Wed', value: 700 },
    { hour: 18, day: 'Wed', value: 790 }, { hour: 19, day: 'Wed', value: 760 }, { hour: 20, day: 'Wed', value: 670 },
    { hour: 21, day: 'Wed', value: 560 }, { hour: 22, day: 'Wed', value: 400 }, { hour: 23, day: 'Wed', value: 260 },
    
    { hour: 0, day: 'Thu', value: 115 }, { hour: 1, day: 'Thu', value: 90 }, { hour: 2, day: 'Thu', value: 60 },
    { hour: 3, day: 'Thu', value: 45 }, { hour: 4, day: 'Thu', value: 30 }, { hour: 5, day: 'Thu', value: 40 },
    { hour: 6, day: 'Thu', value: 65 }, { hour: 7, day: 'Thu', value: 110 }, { hour: 8, day: 'Thu', value: 220 },
    { hour: 9, day: 'Thu', value: 340 }, { hour: 10, day: 'Thu', value: 420 }, { hour: 11, day: 'Thu', value: 480 },
    { hour: 12, day: 'Thu', value: 510 }, { hour: 13, day: 'Thu', value: 490 }, { hour: 14, day: 'Thu', value: 460 },
    { hour: 15, day: 'Thu', value: 520 }, { hour: 16, day: 'Thu', value: 610 }, { hour: 17, day: 'Thu', value: 720 },
    { hour: 18, day: 'Thu', value: 810 }, { hour: 19, day: 'Thu', value: 780 }, { hour: 20, day: 'Thu', value: 690 },
    { hour: 21, day: 'Thu', value: 580 }, { hour: 22, day: 'Thu', value: 420 }, { hour: 23, day: 'Thu', value: 280 },
    
    { hour: 0, day: 'Fri', value: 130 }, { hour: 1, day: 'Fri', value: 100 }, { hour: 2, day: 'Fri', value: 70 },
    { hour: 3, day: 'Fri', value: 55 }, { hour: 4, day: 'Fri', value: 40 }, { hour: 5, day: 'Fri', value: 50 },
    { hour: 6, day: 'Fri', value: 75 }, { hour: 7, day: 'Fri', value: 120 }, { hour: 8, day: 'Fri', value: 230 },
    { hour: 9, day: 'Fri', value: 350 }, { hour: 10, day: 'Fri', value: 430 }, { hour: 11, day: 'Fri', value: 490 },
    { hour: 12, day: 'Fri', value: 520 }, { hour: 13, day: 'Fri', value: 500 }, { hour: 14, day: 'Fri', value: 470 },
    { hour: 15, day: 'Fri', value: 530 }, { hour: 16, day: 'Fri', value: 620 }, { hour: 17, day: 'Fri', value: 730 },
    { hour: 18, day: 'Fri', value: 820 }, { hour: 19, day: 'Fri', value: 790 }, { hour: 20, day: 'Fri', value: 700 },
    { hour: 21, day: 'Fri', value: 590 }, { hour: 22, day: 'Fri', value: 430 }, { hour: 23, day: 'Fri', value: 290 },
    
    { hour: 0, day: 'Sat', value: 140 }, { hour: 1, day: 'Sat', value: 110 }, { hour: 2, day: 'Sat', value: 80 },
    { hour: 3, day: 'Sat', value: 65 }, { hour: 4, day: 'Sat', value: 50 }, { hour: 5, day: 'Sat', value: 60 },
    { hour: 6, day: 'Sat', value: 85 }, { hour: 7, day: 'Sat', value: 130 }, { hour: 8, day: 'Sat', value: 240 },
    { hour: 9, day: 'Sat', value: 360 }, { hour: 10, day: 'Sat', value: 440 }, { hour: 11, day: 'Sat', value: 500 },
    { hour: 12, day: 'Sat', value: 530 }, { hour: 13, day: 'Sat', value: 510 }, { hour: 14, day: 'Sat', value: 480 },
    { hour: 15, day: 'Sat', value: 540 }, { hour: 16, day: 'Sat', value: 630 }, { hour: 17, day: 'Sat', value: 740 },
    { hour: 18, day: 'Sat', value: 830 }, { hour: 19, day: 'Sat', value: 800 }, { hour: 20, day: 'Sat', value: 710 },
    { hour: 21, day: 'Sat', value: 600 }, { hour: 22, day: 'Sat', value: 440 }, { hour: 23, day: 'Sat', value: 300 },
    
    { hour: 0, day: 'Sun', value: 125 }, { hour: 1, day: 'Sun', value: 95 }, { hour: 2, day: 'Sun', value: 65 },
    { hour: 3, day: 'Sun', value: 50 }, { hour: 4, day: 'Sun', value: 35 }, { hour: 5, day: 'Sun', value: 45 },
    { hour: 6, day: 'Sun', value: 70 }, { hour: 7, day: 'Sun', value: 115 }, { hour: 8, day: 'Sun', value: 225 },
    { hour: 9, day: 'Sun', value: 345 }, { hour: 10, day: 'Sun', value: 425 }, { hour: 11, day: 'Sun', value: 485 },
    { hour: 12, day: 'Sun', value: 515 }, { hour: 13, day: 'Sun', value: 495 }, { hour: 14, day: 'Sun', value: 465 },
    { hour: 15, day: 'Sun', value: 525 }, { hour: 16, day: 'Sun', value: 615 }, { hour: 17, day: 'Sun', value: 725 },
    { hour: 18, day: 'Sun', value: 815 }, { hour: 19, day: 'Sun', value: 785 }, { hour: 20, day: 'Sun', value: 695 },
    { hour: 21, day: 'Sun', value: 585 }, { hour: 22, day: 'Sun', value: 425 }, { hour: 23, day: 'Sun', value: 285 },
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
    // In a real implementation, you would fetch data from your database here
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
