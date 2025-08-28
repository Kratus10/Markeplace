// FILE: app/api/admin/subscriptions/route.ts
import { NextResponse } from 'next/server';
import { adminMiddleware } from '@/lib/middleware/adminMiddleware';
import { prisma } from '@/lib/prisma';

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
    const exportFormat = searchParams.get('format');
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date(now);
    
    switch (timeRange) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    // Handle export requests
    if (exportFormat) {
      const subscriptions = await prisma.subscription.findMany({
        where: {
          createdAt: {
            gte: startDate
          }
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Format data for export
      const exportData = subscriptions.map(subscription => ({
        'Subscription ID': subscription.id,
        'User Name': subscription.user?.name || 'N/A',
        'User Email': subscription.user?.email || 'N/A',
        'Plan Type': subscription.planType,
        'Status': subscription.status,
        'Start Date': subscription.startDate.toISOString(),
        'End Date': subscription.endDate.toISOString(),
        'Auto-Renew': subscription.autoRenew ? 'Yes' : 'No',
        'Created At': subscription.createdAt.toISOString()
      }));

      // Generate CSV
      if (exportFormat === 'csv') {
        const headers = Object.keys(exportData[0]).join(',');
        const rows = exportData.map(row => 
          Object.values(row).map(field => 
            `"${String(field).replace(/"/g, '""')}"`
          ).join(',')
        ).join('\n');
        
        const csv = `${headers}\n${rows}`;
        
        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="subscriptions-report-${new Date().toISOString().split('T')[0]}.csv"`
          }
        });
      }
      
      // For other formats, return JSON
      return NextResponse.json({ data: exportData });
    }

    // Get subscriptions with user data
    const subscriptions = await prisma.subscription.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get subscription statistics
    const totalSubscribers = await prisma.subscription.count({
      where: {
        status: 'ACTIVE'
      }
    });

    const monthlySubscribers = await prisma.subscription.count({
      where: {
        planType: 'MONTHLY',
        status: 'ACTIVE'
      }
    });

    const yearlySubscribers = await prisma.subscription.count({
      where: {
        planType: 'YEARLY',
        status: 'ACTIVE'
      }
    });

    // Calculate churn rate (simplified)
    const totalSubscriptions = await prisma.subscription.count();
    const cancelledSubscriptions = await prisma.subscription.count({
      where: {
        status: 'CANCELLED'
      }
    });
    
    const churnRate = totalSubscriptions > 0 
      ? (cancelledSubscriptions / totalSubscriptions) * 100 
      : 0;

    // Calculate revenue (assuming $5/month for monthly, $48/year for yearly)
    const monthlyRevenue = monthlySubscribers * 500; // 500 cents = $5
    const yearlyRevenue = yearlySubscribers * 4800; // 4800 cents = $48
    const totalRevenue = monthlyRevenue + yearlyRevenue;

    // Get subscriber trend data (grouped by day)
    const subscriberTrend = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        COUNT(*) as count
      FROM "Subscription"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `;

    // Get plan distribution
    const planDistribution = await prisma.$queryRaw`
      SELECT 
        "planType" as name,
        COUNT(*) as value
      FROM "Subscription"
      WHERE "status" = 'ACTIVE'
      GROUP BY "planType"
    `;

    // Get status distribution
    const statusDistribution = await prisma.$queryRaw`
      SELECT 
        "status" as name,
        COUNT(*) as value
      FROM "Subscription"
      WHERE "createdAt" >= ${startDate}
      GROUP BY "status"
    `;

    // Calculate growth rate (simplified)
    const previousPeriod = new Date(startDate);
    previousPeriod.setDate(previousPeriod.getDate() - 30);
    
    const previousSubscribers = await prisma.subscription.count({
      where: {
        createdAt: {
          gte: previousPeriod,
          lt: startDate
        }
      }
    });
    
    const currentSubscribers = await prisma.subscription.count({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    });
    
    const growthRate = previousSubscribers > 0 
      ? ((currentSubscribers - previousSubscribers) / previousSubscribers) * 100 
      : 0;

    // Calculate average revenue per user
    const totalUsers = await prisma.user.count();
    const averageRevenuePerUser = totalUsers > 0 ? totalRevenue / totalUsers : 0;

    return NextResponse.json({
      success: true,
      data: {
        subscriptions: subscriptions.map(subscription => ({
          id: subscription.id,
          userId: subscription.userId,
          user: subscription.user,
          planType: subscription.planType,
          status: subscription.status,
          startDate: subscription.startDate.toISOString(),
          endDate: subscription.endDate.toISOString(),
          autoRenew: subscription.autoRenew,
          createdAt: subscription.createdAt.toISOString()
        })),
        stats: {
          totalSubscribers,
          monthlySubscribers,
          yearlySubscribers,
          churnRate,
          revenue: totalRevenue,
          growthRate,
          averageRevenuePerUser,
          subscriberTrend: (subscriberTrend as any[]).map(item => ({
            date: new Date(item.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            }),
            count: parseInt(item.count)
          })),
          planDistribution: (planDistribution as any[]).map(item => ({
            name: item.name,
            value: parseInt(item.value)
          })),
          statusDistribution: (statusDistribution as any[]).map(item => ({
            name: item.name,
            value: parseInt(item.value)
          }))
        }
      }
    });
  } catch (error) {
    console.error('Admin Subscriptions API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' }, 
      { status: 500 }
    );
  }
}