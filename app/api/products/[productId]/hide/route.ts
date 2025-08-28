import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { logProductAudit } from '@/lib/audit/productLifecycle';
import { isAdmin } from '@/lib/auth/helpers';
import { prisma } from '@/lib/prisma';
import { getProductForLifecycle } from '@/lib/products/helpers';
import { z } from 'zod';

const hideSchema = z.object({
  reason: z.string().min(10, 'Reason must be at least 10 characters')
});

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
    const body = await req.json();
    const validation = hideSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { reason } = validation.data;
    const product = await getProductForLifecycle(productId);
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Validate product can be hidden
    if (product.status !== 'PUBLISHED') {
      return NextResponse.json({ 
        error: 'Only published products can be hidden' 
      }, { status: 400 });
    }

    // Update product status
    const updateData = {
      status: 'HIDDEN' as const
    };
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData
    });

    // Log audit event
    await logProductAudit(
      'HIDDEN',
      session.user.id,
      productId,
      { previousStatus: product.status }
    );

    // Remove from search index
    try {
      const { removeProductFromIndex } = await import('@/lib/search/indexer');
      await removeProductFromIndex(productId);
    } catch (error) {
      console.error(`Failed to remove product ${productId} from index:`, error);
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
