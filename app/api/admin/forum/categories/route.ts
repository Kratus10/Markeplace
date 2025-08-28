import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for category creation/update
const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(50, 'Slug too long'),
  description: z.string().max(500, 'Description too long').optional(),
  icon: z.string().max(10, 'Icon too long').optional(),
  color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format').optional(),
  order: z.number().int().min(0).max(999).optional(),
});

export const runtime = "nodejs";

// GET: Fetch all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        order: 'asc'
      }
    });
    
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

// POST: Create a new category (admin only)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  // Check if user is admin
  if (session.user.role !== 'ADMIN') {
    return new NextResponse('Forbidden: Admin access required', { status: 403 });
  }
  
  try {
    const body = await request.json();
    const validation = categorySchema.safeParse(body);
    
    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ error: validation.error.issues }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    const { name, slug, description, icon, color, order } = validation.data;
    
    // Check if category with same slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    });
    
    if (existingCategory) {
      return new NextResponse('Category with this slug already exists', { status: 409 });
    }
    
    // Create the category
    const category = await prisma.category.create({
      data: {
        id: slug, // Use slug as ID for simplicity
        name,
        slug,
        description,
        icon,
        color: color || '#3b82f6',
        order: order || 0,
      }
    });
    
    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error creating category:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

// PUT: Update a category (admin only)
export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  // Check if user is admin
  if (session.user.role !== 'ADMIN') {
    return new NextResponse('Forbidden: Admin access required', { status: 403 });
  }
  
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    // Validate the update data
    const validation = categorySchema.partial().safeParse(updateData);
    
    if (!validation.success) {
      return new NextResponse(
        JSON.stringify({ error: validation.error.issues }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });
    
    if (!existingCategory) {
      return new NextResponse('Category not found', { status: 404 });
    }
    
    // Update the category
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...validation.data,
        // Don't allow changing the ID
        id: undefined
      }
    });
    
    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error updating category:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}

// DELETE: Remove a category (admin only)
export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  
  // Check if user is admin
  if (session.user.role !== 'ADMIN') {
    return new NextResponse('Forbidden: Admin access required', { status: 403 });
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return new NextResponse('Category ID is required', { status: 400 });
    }
    
    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id }
    });
    
    if (!existingCategory) {
      return new NextResponse('Category not found', { status: 404 });
    }
    
    // Check if category has topics (prevent deletion if it has topics)
    const topicCount = await prisma.topic.count({
      where: { categoryId: id }
    });
    
    if (topicCount > 0) {
      return new NextResponse('Cannot delete category with existing topics', { status: 400 });
    }
    
    // Delete the category
    await prisma.category.delete({
      where: { id }
    });
    
    return new NextResponse('Category deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Error deleting category:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}