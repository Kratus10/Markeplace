import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { logProductAudit } from '@/lib/audit/productLifecycle';
import { isAdmin } from '@/lib/auth/helpers';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const productId = params.id;
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify user is admin
  if (!isAdmin(session.user)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Validate product can be approved
    if (product.status !== 'PENDING_REVIEW') {
      return NextResponse.json({ 
        error: 'Only products in pending review can be approved' 
      }, { status: 400 });
    }

    // Update product status
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        status: 'PUBLISHED'
      }
    });

    // Log audit event
    await logProductAudit(
      'APPROVED',
      session.user.id,
      productId,
      { previousStatus: product.status }
    );

    // Add to search index
    try {
      const { indexProduct } = await import('@/lib/search/indexer');
      await indexProduct(productId);
    } catch (error) {
      console.error(`Failed to index product ${productId}:`, error);
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
