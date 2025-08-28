// FILE: app/api/admin/l1/move-topic/route.ts
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

const prisma = new PrismaClient();

// Define role constants
const ROLES = {
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  ADMIN_L1: 'ADMIN_L1',
  ADMIN_L2: 'ADMIN_L2',
  OWNER: 'OWNER'
};

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Check if user has admin L1 permissions or higher
  const isAdminL1 = session.user.role === ROLES.ADMIN_L1 || 
                   session.user.role === ROLES.ADMIN_L2 || 
                   session.user.role === ROLES.OWNER;
  
  if (!isAdminL1) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    const { topicId, newCategoryId } = await req.json();
    
    // Validate input
    if (!topicId || !newCategoryId) {
      return new Response(JSON.stringify({ error: 'Topic ID and new category ID are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if topic exists
    const topic = await prisma.topic.findUnique({
      where: { id: topicId }
    });
    
    if (!topic) {
      return new Response(JSON.stringify({ error: 'Topic not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if new category exists
    const newCategory = await prisma.category.findUnique({
      where: { id: newCategoryId }
    });
    
    if (!newCategory) {
      return new Response(JSON.stringify({ error: 'New category not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Move topic to new category
    const updatedTopic = await prisma.topic.update({
      where: { id: topicId },
      data: { categoryId: newCategoryId }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'TOPIC_MOVED',
        entityId: topicId,
        entityType: 'TOPIC',
        entityName: topic.title,
        status: 'SUCCESS',
        details: JSON.stringify({
          previousCategoryId: topic.categoryId,
          newCategoryId,
          movedById: session.user.id
        }),
        userId: session.user.id
      }
    });
    
    return new Response(JSON.stringify({
      message: 'Topic moved successfully',
      topic: updatedTopic
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error moving topic:', error);
    
    // Create audit log for failed attempt
    if (session.user.id) {
      await prisma.auditLog.create({
        data: {
          action: 'TOPIC_MOVE_FAILED',
          entityType: 'TOPIC',
          status: 'FAILURE',
          details: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error',
            movedById: session.user.id
          }),
          userId: session.user.id
        }
      });
    }
    
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  } finally {
    await prisma.$disconnect();
  }
}