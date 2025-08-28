// FILE: app/api/admin/analytics/alerts/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

// Mock data - in a real implementation, this would query your database
const mockAlerts = [
  {
    id: '1',
    title: 'Unusual Traffic Spike',
    description: 'Traffic increased by 35% compared to the same time last week',
    severity: 'medium',
    timestamp: '2024-02-28T14:30:00Z',
    acknowledged: false
  },
  {
    id: '2',
    title: 'Drop in Conversion Rate',
    description: 'Conversion rate dropped to 3.2%, down from 4.8% yesterday',
    severity: 'high',
    timestamp: '2024-02-28T12:15:00Z',
    acknowledged: false
  },
  {
    id: '3',
    title: 'Server Response Time Increase',
    description: 'Average response time increased to 850ms, up from 420ms',
    severity: 'medium',
    timestamp: '2024-02-28T10:45:00Z',
    acknowledged: true
  },
  {
    id: '4',
    title: 'Payment Processing Issues',
    description: '5% of payments failed in the last hour',
    severity: 'critical',
    timestamp: '2024-02-28T09:20:00Z',
    acknowledged: false
  }
];

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and has admin role
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';
    
    // Filter alerts based on the filter parameter
    let filteredAlerts = mockAlerts;
    
    if (filter === 'unacknowledged') {
      filteredAlerts = mockAlerts.filter(alert => !alert.acknowledged);
    }
    
    // Sort by timestamp (newest first)
    filteredAlerts.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    return NextResponse.json({
      success: true,
      data: filteredAlerts
    });
  } catch (error) {
    console.error('Analytics Alerts API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and has admin role
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { alertId } = body;
    
    // Validate inputs
    if (!alertId) {
      return NextResponse.json({ error: 'Alert ID is required' }, { status: 400 });
    }
    
    // In a real implementation, you would:
    // 1. Find the alert in the database
    // 2. Update the acknowledged status
    // 3. Save the changes
    
    // For this example, we'll just return success
    console.log('Acknowledging alert:', alertId);
    
    return NextResponse.json({
      success: true,
      message: `Alert ${alertId} acknowledged`
    });
  } catch (error) {
    console.error('Analytics Alerts API error:', error);
    return NextResponse.json(
      { error: 'Failed to acknowledge alert' }, 
      { status: 500 }
    );
  }
}
