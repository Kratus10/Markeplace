// FILE: app/api/admin/users/[id]/role/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { adminMiddleware } from '@/lib/middleware/adminMiddleware';
import { createAuditLog, logRoleChange } from '@/lib/services/auditService';

// Define role constants
const ROLES = {
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  ADMIN_L1: 'ADMIN_L1',
  ADMIN_L2: 'ADMIN_L2',
  OWNER: 'OWNER'
};

// Define valid roles
const VALID_ROLES = Object.values(ROLES);

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  // Check admin authorization
  const authResponse = await adminMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  try {
    const session = await getServerSession(authOptions);
    const { role } = await req.json();
    
    // Validate role
    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' }, 
        { status: 400 }
      );
    }
    
    // Prevent removing the last owner
    if (session?.user.id === params.id && role !== ROLES.OWNER) {
      // Check if this is the last owner
      const ownerCount = await prisma.user.count({
        where: {
          role: ROLES.OWNER
        }
      });
      
      if (ownerCount <= 1) {
        // Log the attempt
        await createAuditLog({
          action: 'OWNER_REMOVAL_FAILED',
          entityType: 'USER',
          status: 'FAILURE',
          details: {
            reason: 'Cannot remove the last owner user',
            attemptedById: session.user.id
          },
          userId: session.user.id
        });
        
        return NextResponse.json(
          { error: 'Cannot remove the last owner user' }, 
          { status: 400 }
        );
      }
    }
    
    // Get current user role for audit log
    const currentUser = await prisma.user.findUnique({
      where: { id: params.id }
    });
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }
    
    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { role }
    });
    
    // Log the role change
    if (session?.user.id) {
      await logRoleChange(
        params.id,
        currentUser.role,
        role,
        session.user.id
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    console.error('Admin User Role Update API error:', error);
    
    // Log the error
    const session = await getServerSession(authOptions);
    if (session?.user.id) {
      await createAuditLog({
        action: 'USER_ROLE_UPDATE_FAILED',
        entityType: 'USER',
        status: 'FAILURE',
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
          userId: params.id
        },
        userId: session.user.id
      });
    }
    
    return NextResponse.json(
      { error: 'Failed to update user role' }, 
      { status: 500 }
    );
  }
}