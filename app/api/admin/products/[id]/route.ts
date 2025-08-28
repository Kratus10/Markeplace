// FILE: app/api/admin/products/[id]/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { adminMiddleware } from '@/lib/middleware/adminMiddleware';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  // Check admin authorization
  const authResponse = await adminMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: {
        category: {
          select: {
            name: true
          }
        }
      }
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Admin Product API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' }, 
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  // Check admin authorization
  const authResponse = await adminMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  try {
    const { name, description, price, categoryId, status } = await req.json();
    
    // Update product
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        description,
        price,
        categoryId: categoryId || null,
        status
      }
    });
    
    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Admin Update Product API error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  // Check admin authorization
  const authResponse = await adminMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  try {
    // Delete product
    await prisma.product.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Admin Delete Product API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' }, 
      { status: 500 }
    );
  }
}