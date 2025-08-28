import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import type { Order } from '@prisma/client';
import { createHmac } from 'crypto';
import { storeNonce, isNonceUsed } from '@/lib/nonce-store';
import { generateLicense } from '@/lib/license/generate';
import { sendLicenseEmail } from '@/lib/email/sendLicenseEmail';

const BINANCE_PAY_API_SECRET = process.env.BINANCE_PAY_API_SECRET as string;

if (!BINANCE_PAY_API_SECRET) {
  throw new Error('Binance Pay API secret is missing in environment variables');
}

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = headers();
    
    // Get required headers
    const binancePayTimestamp = headersList.get('binancepay-timestamp');
    const binancePayNonce = headersList.get('binancepay-nonce');
    const binancePaySignature = headersList.get('binancepay-signature');
    const binancePayCertificateSN = headersList.get('binancepay-certificate-sn');

    // Verify required headers are present
    if (!binancePayTimestamp || !binancePayNonce || !binancePaySignature || !binancePayCertificateSN) {
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

  // Verify nonce to prevent replay attacks and store it with 10 minute TTL
  const isDuplicate = await storeNonce(binancePayNonce, 600);
  if (!isDuplicate) {
    return NextResponse.json(
      { error: 'Duplicate request detected' },
      { status: 400 }
    );
  }

    // Verify signature
    const signaturePayload = `${body}\n${binancePayNonce}\n${binancePayTimestamp}\n`;
    const expectedSignature = createHmac('sha512', BINANCE_PAY_API_SECRET)
      .update(signaturePayload, 'utf-8')
      .digest('hex');

    if (binancePaySignature !== expectedSignature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const orderStatus = event.bizStatus;

    // Get merchantTradeNo from event
    const merchantTradeNo = event.merchantTradeNo;
    if (!merchantTradeNo) {
      return NextResponse.json(
        { error: 'Missing merchantTradeNo in payload' },
        { status: 400 }
      );
    }

    // Find the payment mapping
    const paymentMapping = await prisma.paymentMapping.findUnique({
      where: { merchantTradeNo },
      include: { order: true }
    });

    if (!paymentMapping || !paymentMapping.order) {
      return NextResponse.json(
        { error: 'Order not found for merchantTradeNo' },
        { status: 404 }
      );
    }

    const order = paymentMapping.order;
    let newStatus: Order['status'] = 'FAILED';

    // Map Binance status to our order status
    if (orderStatus === 'PAID') {
      newStatus = 'PAID';
    } else if (orderStatus === 'EXPIRED' || orderStatus === 'CANCELLED') {
      newStatus = 'CANCELED';
    }

  // Generate licenses for each product in the order
  if (newStatus === 'PAID') {
    const orderWithItems = await prisma.order.findUnique({
      where: { id: order.id },
      include: { items: true }
    });

    if (orderWithItems && orderWithItems.items) {
      for (const item of orderWithItems.items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });
        
        if (product) {
          const { rawLicense } = await generateLicense({
            product,
            userId: order.userId,
            orderId: order.id
          });
          // TODO: Send email with license
          console.log(`Generated license: ${rawLicense} for user ${order.userId}`);
        }
      }
    }
  }

    // Update order status
    await prisma.order.update({
      where: { id: order.id },
      data: { status: newStatus }
    });

    // If payment was successful, generate license and send email
    if (newStatus === 'PAID') {
      try {
        // Get product from order
        const orderItem = await prisma.orderItem.findFirst({
          where: { orderId: order.id }
        });
        
        if (!orderItem) {
          throw new Error('Order item not found');
        }

        const product = await prisma.product.findUnique({
          where: { id: orderItem.productId }
        });

        if (!product) {
          throw new Error('Product not found');
        }

        const user = await prisma.user.findUnique({
          where: { id: order.userId }
        });

        if (!user) {
          throw new Error('User not found');
        }

        // Generate license
        const { rawLicense } = await generateLicense({ 
          product, 
          userId: user.id,
          orderId: order.id
        });

        // Get download URL
        const license = await prisma.license.findFirst({
          where: { orderId: order.id }
        });
        
        if (!license) {
          throw new Error('License not generated');
        }

        // Send license email
        await sendLicenseEmail({ 
          licenseId: license.id,
          rawLicense,
          productName: product.name,
          userName: user.name || user.email,
          userEmail: user.email
        });
      } catch (error) {
        console.error('License generation/email error:', error);
        // Log error but don't fail the webhook
      }
    }

    // Log the event
    await prisma.auditLog.create({
      data: {
        action: 'PAYMENT_UPDATE',
        actorId: 'system',
        targetType: 'ORDER',
        targetId: order.id,
        details: {
          event,
          oldStatus: order.status,
          newStatus
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Binance Pay webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
