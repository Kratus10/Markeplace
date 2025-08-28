// FILE: app/api/admin/payments/route.ts
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
      const payments = await prisma.payment.findMany({
        where: {
          createdAt: {
            gte: startDate
          }
        },
        include: {
          order: {
            select: {
              id: true,
              product: {
                select: {
                  name: true
                }
              },
              user: {
                select: {
                  email: true
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Format data for export
      const exportData = payments.map(payment => ({
        'Payment ID': payment.id,
        'Order ID': payment.orderId,
        'Product': payment.order?.product?.name || 'N/A',
        'Customer Email': payment.order?.user?.email || 'N/A',
        'Provider': payment.provider,
        'Amount': `${(payment.amountCents / 100).toFixed(2)}`,
        'Currency': payment.currency,
        'Status': payment.status,
        'Transaction ID': payment.transactionId || 'N/A',
        'Date': payment.createdAt.toISOString()
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
            'Content-Disposition': `attachment; filename="payments-report-${new Date().toISOString().split('T')[0]}.csv"`
          }
        });
      }
      
      // For other formats, return JSON
      return NextResponse.json({ data: exportData });
    }

    // Get payments with related data
    const payments = await prisma.payment.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        order: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50
    });

    // Get payment statistics
    const totalRevenueResult = await prisma.payment.aggregate({
      where: {
        status: 'SUCCESS',
        createdAt: {
          gte: startDate
        }
      },
      _sum: {
        amountCents: true
      }
    });

    const totalPayments = await prisma.payment.count({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    });

    const pendingPayments = await prisma.payment.count({
      where: {
        status: 'PENDING',
        createdAt: {
          gte: startDate
        }
      }
    });

    const failedPayments = await prisma.payment.count({
      where: {
        status: 'FAILED',
        createdAt: {
          gte: startDate
        }
      }
    });

    const successPayments = await prisma.payment.count({
      where: {
        status: 'SUCCESS',
        createdAt: {
          gte: startDate
        }
      }
    });

    const totalRevenue = totalRevenueResult._sum.amountCents || 0;
    const successRate = totalPayments > 0 ? (successPayments / totalPayments) * 100 : 0;
    const averagePayment = successPayments > 0 ? totalRevenue / successPayments : 0;

    // Get revenue trend data (grouped by day)
    const revenueTrend = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date,
        SUM("amountCents") as amount
      FROM "Payment"
      WHERE "status" = 'SUCCESS' 
        AND "createdAt" >= ${startDate}
      GROUP BY DATE("createdAt")
      ORDER BY date
    `;

    // Get provider distribution
    const providerDistribution = await prisma.$queryRaw`
      SELECT 
        "provider" as name,
        COUNT(*) as value
      FROM "Payment"
      WHERE "createdAt" >= ${startDate}
      GROUP BY "provider"
    `;

    // Get status distribution
    const statusDistribution = await prisma.$queryRaw`
      SELECT 
        "status" as name,
        COUNT(*) as value
      FROM "Payment"
      WHERE "createdAt" >= ${startDate}
      GROUP BY "status"
    `;

    return NextResponse.json({
      success: true,
      data: {
        payments: payments.map(payment => ({
          id: payment.id,
          orderId: payment.orderId,
          provider: payment.provider,
          amountCents: payment.amountCents,
          currency: payment.currency,
          status: payment.status,
          transactionId: payment.transactionId,
          createdAt: payment.createdAt.toISOString()
        })),
        stats: {
          totalRevenue,
          totalPayments,
          pendingPayments,
          failedPayments,
          successRate,
          averagePayment,
          revenueTrend: (revenueTrend as any[]).map(item => ({
            date: new Date(item.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            }),
            amount: parseInt(item.amount)
          })),
          providerDistribution: (providerDistribution as any[]).map(item => ({
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
    console.error('Admin Payments API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' }, 
      { status: 500 }
    );
  }
}