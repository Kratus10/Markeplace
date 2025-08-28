import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { logProductAudit } from '@/lib/audit/productLifecycle';
import { getProductForLifecycle } from '@/lib/products/helpers';
import { prisma } from '@/lib/prisma'; // Add prisma import

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const productId = params.id;
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const product = await getProductForLifecycle(productId);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Check ownership
    if (product.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Validate product can be submitted
    if (product.status !== 'DRAFT') {
      return NextResponse.json({ 
        error: 'Only draft products can be submitted for review' 
      }, { status: 400 });
    }

    // Update product status
    const updateData = {
      status: 'PENDING_REVIEW' as const
    };
    
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData
    });

    // Log audit event
    await logProductAudit(
      'SUBMITTED_FOR_REVIEW',
      session.user.id,
      productId,
      { previousStatus: product.status }
    );

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
