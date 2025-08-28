
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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Fetch users with subscriptions, orders, topics, and comments
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      include: {
        subscriptions: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        orders: true,
        topics: true,
        comments: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Get total count
    const total = await prisma.user.count();
    
    return NextResponse.json({
      success: true,
      data: {
        users: users.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString(),
          subscriptions: user.subscriptions.map(sub => ({
            id: sub.id,
            planType: sub.planType,
            status: sub.status,
            startDate: sub.startDate.toISOString(),
            endDate: sub.endDate.toISOString()
          })),
          orders: user.orders.map(order => ({
            id: order.id,
            productId: order.productId,
            status: order.status,
            createdAt: order.createdAt.toISOString()
          })),
          topics: user.topics.map(topic => ({
            id: topic.id,
            title: topic.title,
            createdAt: topic.createdAt.toISOString()
          })),
          comments: user.comments.map(comment => ({
            id: comment.id,
            content: comment.content,
            createdAt: comment.createdAt.toISOString()
          }))
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Admin Users API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' }, 
      { status: 500 }
    );
  }
}
