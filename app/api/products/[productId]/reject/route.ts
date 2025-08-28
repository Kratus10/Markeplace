import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { logProductAudit } from '@/lib/audit/productLifecycle';
import { isAdmin } from '@/lib/auth/helpers';
import { prisma } from '@/lib/prisma';
import { getProductForLifecycle } from '@/lib/products/helpers';
import { z } from 'zod';

const rejectSchema = z.object({
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
    const validation = rejectSchema.safeParse(body);
    
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

    // Validate product can be rejected
    if (product.status !== 'PENDING_REVIEW') {
      return NextResponse.json({ 
        error: 'Only products in pending review can be rejected' 
      }, { status: 400 });
    }

    // Update product status
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        status: 'REJECTED'
      }
    });

    // Log audit event
    await logProductAudit(
      'REJECTED',
      session.user.id,
      productId,
      { previousStatus: product.status }
    );

    // TODO: Send notification to product owner

    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
