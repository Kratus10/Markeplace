import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth/authOptions';
import { z } from 'zod';

export const runtime = "nodejs"; // Use Node.js runtime to support Prisma

const createOrderSchema = z.object({
  productId: z.string().cuid(),
  // Payment method will be added later
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const result = createOrderSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: result.error.message }, { status: 400 });
  }

  const { productId } = result.data;
  const userId = session.user.id;

  try {
    // Fetch product to verify it's available
    const product = await prisma.product.findUnique({
      where: { id: productId, status: 'PUBLISHED' }
    });

    if (!product) {
      return NextResponse.json({ error: 'Product available' }, { status: 400 });
    }

    // Create the order
    const order = await prisma.order.create({
      data: {
        userId,
        productId,
        amountCents: product.price,
        currency: 'USD', // Will be configurable
      }
    });

    return NextResponse.json({ 
      orderId: order.id, 
      amount: order.amountCents,
      currency: order.currency,
      // Payment URL will be added when integrating payment providers
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
