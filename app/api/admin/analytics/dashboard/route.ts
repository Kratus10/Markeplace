// FILE: app/api/admin/analytics/dashboard/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { adminMiddleware } from '@/lib/middleware/adminMiddleware';
import { 
  getDashboardKpis, 
  getTimeseriesData, 
  getFunnelData, 
  getCohortData, 
  getTopProducts, 
  getTrafficSources 
} from '@/lib/services/analyticsService';

export async function GET(req: Request) {
  // Check admin authorization
  const authResponse = await adminMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const timeRange = searchParams.get('timeRange') || '30d';
    
    // Fetch real data from the database
    const [kpis, timeseries, funnel, cohort, topProducts, trafficSources] = await Promise.all([
      getDashboardKpis(timeRange),
      getTimeseriesData(timeRange),
      getFunnelData(timeRange),
      getCohortData(timeRange),
      getTopProducts(timeRange),
      getTrafficSources()
    ]);
    
    const data = {
      kpis,
      timeseries,
      funnel,
      cohort,
      topProducts,
      trafficSources
    };
    
    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Dashboard Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard analytics data' }, 
      { status: 500 }
    );
  }
}