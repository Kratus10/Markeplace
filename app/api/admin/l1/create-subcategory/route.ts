// FILE: app/api/admin/l1/create-subcategory/route.ts
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
    return new Response(JSON.stringify({ error: 'Unauthorized' }, {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }));
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
    const { name, description, categoryId } = await req.json();
    
    // Validate input
    if (!name || !categoryId) {
      return new Response(JSON.stringify({ error: 'Name and category ID are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });
    
    if (!category) {
      return new Response(JSON.stringify({ error: 'Category not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Create subcategory (as a new category with parentId)
    // In this implementation, we're using the existing Category model
    // You might want to extend the schema to have a parent relationship
    const subcategory = await prisma.category.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description,
        // parentId: categoryId, // Uncomment when you extend the schema
      }
    });
    
    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'SUBCATEGORY_CREATED',
        entityId: subcategory.id,
        entityType: 'CATEGORY',
        entityName: subcategory.name,
        status: 'SUCCESS',
        details: JSON.stringify({
          categoryId,
          createdById: session.user.id
        }),
        userId: session.user.id
      }
    });
    
    return new Response(JSON.stringify({
      message: 'Subcategory created successfully',
      subcategory
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    
    // Create audit log for failed attempt
    if (session.user.id) {
      await prisma.auditLog.create({
        data: {
          action: 'SUBCATEGORY_CREATION_FAILED',
          entityType: 'CATEGORY',
          status: 'FAILURE',
          details: JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error',
            createdById: session.user.id
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