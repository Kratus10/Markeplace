import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { ProductUpdateSchema } from '@/lib/validators/product';
import { generateUniqueSlug, createSlugRedirect } from '@/lib/products/slug';
import { isAdmin } from '@/lib/auth/helpers';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id;
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check access rights
    const session = await getServerSession(authOptions);
    const canAccess = product.status === 'PUBLISHED' || 
                     (session?.user && (session.user.id === product.userId || isAdmin(session.user)));
    
    if (!canAccess) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const productId = params.id;
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Verify user can edit
    if (session.user.id !== product.userId && !isAdmin(session.user)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const validation = ProductUpdateSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const updateData: any = validation.data;
    let newSlug = null;

    // If name changed, generate new slug
    if (updateData.name && updateData.name !== product.name) {
      newSlug = await generateUniqueSlug(updateData.name, productId);
      updateData.slug = newSlug;
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData
    });

    // Create slug redirect if slug changed
    if (newSlug) {
      await createSlugRedirect(product.slug, newSlug, productId);
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const productId = params.id;
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Verify user can delete
    const isOwner = session.user.id === product.userId;
    const canDelete = (isOwner && product.status === 'DRAFT') || isAdmin(session.user);
    
    if (!canDelete) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Perform deletion
    await prisma.product.delete({
      where: { id: productId }
    });

    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
