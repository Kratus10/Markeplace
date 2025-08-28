// FILE: app/api/admin/analytics/sales/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

// Mock data - in a real implementation, this would query your database
const mockSalesData = {
  revenue: [
    { month: 'Jan', revenue: 42198, orders: 842, customers: 12483 },
    { month: 'Feb', revenue: 45800, orders: 923, customers: 13870 },
    { month: 'Mar', revenue: 48200, orders: 987, customers: 14560 },
    { month: 'Apr', revenue: 51600, orders: 1056, customers: 15230 },
    { month: 'May', revenue: 54200, orders: 1124, customers: 16870 },
    { month: 'Jun', revenue: 52800, orders: 1087, customers: 16230 },
  ],
  conversion: [
    { stage: 'Visits', count: 15420, rate: 100 },
    { stage: 'Signups', count: 3210, rate: 20.8 },
    { stage: 'Checkout', count: 1420, rate: 9.2 },
    { stage: 'Purchases', count: 842, rate: 5.5 },
    { stage: 'Repeat Purchases', count: 215, rate: 1.4 },
  ],
  products: [
    { product: 'Product A', revenue: 12420, unitsSold: 1242, profitMargin: 32 },
    { product: 'Product B', revenue: 9870, unitsSold: 987, profitMargin: 28 },
    { product: 'Product C', revenue: 7560, unitsSold: 756, profitMargin: 35 },
    { product: 'Product D', revenue: 6320, unitsSold: 632, profitMargin: 25 },
    { product: 'Product E', revenue: 4200, unitsSold: 420, profitMargin: 40 },
  ],
  regions: [
    { region: 'North America', sales: 22450, growth: 12.4 },
    { region: 'Europe', sales: 15680, growth: 8.2 },
    { region: 'Asia Pacific', sales: 18920, growth: 15.7 },
    { region: 'Latin America', sales: 8760, growth: 5.3 },
    { region: 'Africa', sales: 4580, growth: 2.1 },
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
      data: mockSalesData
    });
  } catch (error) {
    console.error('Sales Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sales analytics data' }, 
      { status: 500 }
    );
  }
}