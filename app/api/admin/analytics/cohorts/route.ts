// FILE: app/api/admin/analytics/cohorts/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

// Mock data - in a real implementation, this would query your database
const mockCohortData = {
  retention: [
    { cohort: "Jan 2024", periods: [100, 78, 65, 52, 43, 35, 28] },
    { cohort: "Dec 2023", periods: [100, 72, 58, 46, 38, 31, 25] },
    { cohort: "Nov 2023", periods: [100, 68, 52, 41, 34, 27, 22] },
    { cohort: "Oct 2023", periods: [100, 65, 48, 38, 31, 25, 20] },
  ],
  labels: ["Period 0", "Period 1", "Period 2", "Period 3", "Period 4", "Period 5", "Period 6"],
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
      data: mockCohortData
    });
  } catch (error) {
    console.error('Cohort Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cohort analytics data' }, 
      { status: 500 }
    );
  }
}