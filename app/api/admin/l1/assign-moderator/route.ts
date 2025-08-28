// FILE: app/api/admin/l1/assign-moderator/route.ts
import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { withAdminL1Protection } from '@/lib/middleware/adminRoleMiddleware';

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
  // Use our middleware to check permissions
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
    const { userId } = await req.json();
    
    // Validate input
    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update user role to moderator
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: ROLES.MODERATOR }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'USER_ROLE_CHANGED',
        entityId: userId,
        entityType: 'USER',
        entityName: user.name || user.email || 'Unknown User',
        status: 'SUCCESS',
        details: JSON.stringify({
          previousRole: user.role,
          newRole: ROLES.MODERATOR,
          changedBy: session.user.id
        }),
        userId: session.user.id
      }
    });
    
    return new Response(JSON.stringify({
      message: 'User role updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error assigning moderator:', error);
    
    // Create audit log for failed attempt
    if (session.user.id) {
      await prisma.auditLog.create({
        data: {
          action: 'USER_ROLE_CHANGE_FAILED',
          entityType: 'USER',
          status: 'FAILURE',
          details: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error',
            changedBy: session.user.id
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