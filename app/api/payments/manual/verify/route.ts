import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Order } from '@prisma/client';
import { verifyManualPayment } from '@/lib/payments/manual';

export async function POST(req: Request) {
  try {
    const { orderId, txHash } = await req.json();

    // Get order details
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify the payment
    const isValid = await verifyManualPayment(order);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID'
      }
    });

    return NextResponse.json({ 
      ok: true,
      message: 'Payment verified successfully' 
    });
  } catch (error) {
    console.error('Manual payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
