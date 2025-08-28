import { prisma } from '@/lib/prisma';

// Get KPI data for the dashboard
export async function getDashboardKpis(timeRange: string = '30d') {
  try {
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

    // Get total users
    const totalUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Get active users (users with recent engagement)
    const activeUsers = await prisma.user.count({
      where: {
        engagementEvents: {
          some: {
            createdAt: {
              gte: startDate,
            },
          },
        },
      },
    });

    // Get total topics
    const totalTopics = await prisma.topic.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Get total comments
    const totalComments = await prisma.comment.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Calculate previous period for delta calculations
    const previousStartDate = new Date(startDate);
    const previousEndDate = new Date(startDate);
    
    switch (timeRange) {
      case '7d':
        previousStartDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        previousStartDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        previousStartDate.setDate(startDate.getDate() - 90);
        break;
      default:
        previousStartDate.setDate(startDate.getDate() - 30);
    }

    // Get previous period data
    const previousTotalUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: previousStartDate,
          lt: startDate,
        },
      },
    });

    const previousActiveUsers = await prisma.user.count({
      where: {
        engagementEvents: {
          some: {
            createdAt: {
              gte: previousStartDate,
              lt: startDate,
            },
          },
        },
      },
    });

    const previousTotalTopics = await prisma.user.count({
      where: {
        topics: {
          some: {
            createdAt: {
              gte: previousStartDate,
              lt: startDate,
            },
          },
        },
      },
    });

    const previousTotalComments = await prisma.user.count({
      where: {
        comments: {
          some: {
            createdAt: {
              gte: previousStartDate,
              lt: startDate,
            },
          },
        },
      },
    });

    // Calculate deltas
    const userDelta = previousTotalUsers > 0 
      ? parseFloat(((totalUsers - previousTotalUsers) / previousTotalUsers * 100).toFixed(1))
      : 0;
      
    const activeUserDelta = previousActiveUsers > 0 
      ? parseFloat(((activeUsers - previousActiveUsers) / previousActiveUsers * 100).toFixed(1))
      : 0;
      
    const topicDelta = previousTotalTopics > 0 
      ? parseFloat(((totalTopics - previousTotalTopics) / previousTotalTopics * 100).toFixed(1))
      : 0;
      
    const commentDelta = previousTotalComments > 0 
      ? parseFloat(((totalComments - previousTotalComments) / previousTotalComments * 100).toFixed(1))
      : 0;

    return [
      {
        title: "Total Users",
        value: totalUsers.toLocaleString(),
        delta: userDelta,
      },
      {
        title: "Active Users",
        value: activeUsers.toLocaleString(),
        delta: activeUserDelta,
      },
      {
        title: "Total Topics",
        value: totalTopics.toLocaleString(),
        delta: topicDelta,
      },
      {
        title: "Total Comments",
        value: totalComments.toLocaleString(),
        delta: commentDelta,
      },
    ];
  } catch (error) {
    console.error('Error fetching dashboard KPIs:', error);
    throw new Error('Failed to fetch dashboard KPIs');
  }
}

// Get timeseries data for user growth
export async function getTimeseriesData(timeRange: string = '30d') {
  try {
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

    // Group by week for better visualization
    const interval = timeRange === '7d' ? 'day' : timeRange === '30d' ? 'week' : 'month';
    
    // Get user growth data
    const userData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "createdAt") as date,
        COUNT(*) as count
      FROM "User"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date
    `;

    // Get topic growth data
    const topicData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "createdAt") as date,
        COUNT(*) as count
      FROM "Topic"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date
    `;

    // Get comment growth data
    const commentData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "createdAt") as date,
        COUNT(*) as count
      FROM "Comment"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date
    `;

    // Format data for charts
    const formattedData: any[] = [];
    
    // Create a map of dates to data points
    const userMap = new Map();
    const topicMap = new Map();
    const commentMap = new Map();
    
    (userData as any[]).forEach((item: any) => {
      const date = new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      userMap.set(date, parseInt(item.count));
    });
    
    (topicData as any[]).forEach((item: any) => {
      const date = new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      topicMap.set(date, parseInt(item.count));
    });
    
    (commentData as any[]).forEach((item: any) => {
      const date = new Date(item.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      commentMap.set(date, parseInt(item.count));
    });
    
    // Combine all dates
    const allDates = new Set([
      ...userMap.keys(),
      ...topicMap.keys(),
      ...commentMap.keys()
    ]);
    
    // Create formatted data array
    allDates.forEach(date => {
      formattedData.push({
        date,
        users: userMap.get(date) || 0,
        topics: topicMap.get(date) || 0,
        comments: commentMap.get(date) || 0
      });
    });
    
    // Sort by date
    formattedData.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
    
    return formattedData;
  } catch (error) {
    console.error('Error fetching timeseries data:', error);
    throw new Error('Failed to fetch timeseries data');
  }
}

// Get funnel data (simplified for this example)
export async function getFunnelData(timeRange: string = '30d') {
  try {
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

    // Get total visits (users who signed up)
    const totalVisits = await prisma.user.count({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    // Get users who created topics
    const topicCreators = await prisma.user.count({
      where: {
        topics: {
          some: {
            createdAt: {
              gte: startDate,
            },
          },
        },
      },
    });

    // Get users who created comments
    const commenters = await prisma.user.count({
      where: {
        comments: {
          some: {
            createdAt: {
              gte: startDate,
            },
          },
        },
      },
    });

    // Get users with engagement events
    const engagedUsers = await prisma.user.count({
      where: {
        engagementEvents: {
          some: {
            createdAt: {
              gte: startDate,
            },
          },
        },
      },
    });

    return [
      { name: "Signups", count: totalVisits, rate: 100 },
      { name: "Topic Creators", count: topicCreators, rate: totalVisits > 0 ? Math.round((topicCreators / totalVisits) * 100) : 0 },
      { name: "Commenters", count: commenters, rate: totalVisits > 0 ? Math.round((commenters / totalVisits) * 100) : 0 },
      { name: "Engaged Users", count: engagedUsers, rate: totalVisits > 0 ? Math.round((engagedUsers / totalVisits) * 100) : 0 },
    ];
  } catch (error) {
    console.error('Error fetching funnel data:', error);
    throw new Error('Failed to fetch funnel data');
  }
}

// Get cohort analysis data
export async function getCohortData(timeRange: string = '30d') {
  try {
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

    // Get cohorts by signup month
    const cohorts = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as cohort,
        COUNT(*) as total_users
      FROM "User"
      WHERE "createdAt" >= ${startDate}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY cohort
    `;

    // Get retention data for each cohort
    const retentionData: any[] = [];
    
    for (const cohort of cohorts as any[]) {
      const cohortDate = new Date(cohort.cohort);
      
      // Get users in this cohort
      const cohortUsers = await prisma.user.findMany({
        where: {
          createdAt: {
            gte: cohortDate,
            lt: new Date(cohortDate.getFullYear(), cohortDate.getMonth() + 1, 1)
          }
        },
        select: {
          id: true,
          createdAt: true
        }
      });
      
      if (cohortUsers.length === 0) continue;
      
      // Calculate retention for 6 periods (months)
      const periods = [];
      for (let i = 0; i <= 6; i++) {
        const periodStart = new Date(cohortDate);
        periodStart.setMonth(cohortDate.getMonth() + i);
        
        const periodEnd = new Date(periodStart);
        periodEnd.setMonth(periodStart.getMonth() + 1);
        
        // Count users who were active in this period
        const activeUsers = await prisma.user.count({
          where: {
            id: {
              in: cohortUsers.map(u => u.id)
            },
            OR: [
              {
                topics: {
                  some: {
                    createdAt: {
                      gte: periodStart,
                      lt: periodEnd
                    }
                  }
                }
              },
              {
                comments: {
                  some: {
                    createdAt: {
                      gte: periodStart,
                      lt: periodEnd
                    }
                  }
                }
              },
              {
                engagementEvents: {
                  some: {
                    createdAt: {
                      gte: periodStart,
                      lt: periodEnd
                    }
                  }
                }
              }
            ]
          }
        });
        
        // Calculate retention percentage
        const retention = cohortUsers.length > 0 
          ? Math.round((activeUsers / cohortUsers.length) * 100) 
          : 0;
          
        periods.push(retention);
      }
      
      retentionData.push({
        cohort: cohortDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        }),
        periods
      });
    }
    
    return {
      retention: retentionData,
      labels: ["Period 0", "Period 1", "Period 2", "Period 3", "Period 4", "Period 5", "Period 6"]
    };
  } catch (error) {
    console.error('Error fetching cohort data:', error);
    throw new Error('Failed to fetch cohort data');
  }
}

// Get top products data (using topics as products for this example)
export async function getTopProducts(timeRange: string = '30d') {
  try {
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

    // Get top categories by topic count
    const categories = await prisma.category.findMany({
      include: {
        topics: {
          where: {
            createdAt: {
              gte: startDate,
            },
          },
        },
      },
    });

    // Format data
    const productData = categories
      .map(category => ({
        product: category.name,
        sales: category.topics.length,
        revenue: `${(category.topics.length * 10).toLocaleString()}`, // Mock revenue
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    return productData;
  } catch (error) {
    console.error('Error fetching top products data:', error);
    throw new Error('Failed to fetch top products data');
  }
}

// Get traffic sources data (mock data for now)
export async function getTrafficSources() {
  return [
    { source: "Direct", percentage: 42 },
    { source: "Social Media", percentage: 28 },
    { source: "Search Engines", percentage: 18 },
    { source: "Referrals", percentage: 12 },
  ];
}