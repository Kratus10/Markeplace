import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyBinancePayWebhook } from '@/lib/payments/binanceWebhook';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawBody = JSON.stringify(body);
    
    // Verify webhook signature
    const signature = req.headers.get('binancepay-signature');
    const timestamp = req.headers.get('binancepay-timestamp');
    
    if (!signature || !timestamp) {
      return NextResponse.json({ error: 'Missing signature or timestamp' }, { status: 400 });
    }
    
    if (!verifyBinancePayWebhook(rawBody, signature, timestamp)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
    
    // Process the payment notification
    const { merchantTradeNo, tradeStatus } = body;
    
    // Extract order ID from merchantTradeNo
    // Format: TRADE_{orderId}_{timestamp}
    const orderId = merchantTradeNo.split('_')[1];
    
    if (!orderId) {
      return NextResponse.json({ error: 'Invalid merchant trade number' }, { status: 400 });
    }
    
    // Find the order
    const order = await prisma.order.findUnique({
      where: { id: `order_${orderId}` }
    });
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Update order status based on trade status
    if (tradeStatus === 'SUCCESS') {
      // Update order status
      await prisma.order.update({
        where: { id: `order_${orderId}` },
        data: { status: 'PAID' }
      });
      
      // Create subscription
      const planType = order.amountCents === 500 ? 'MONTHLY' : 'YEARLY';
      const startDate = new Date();
      const endDate = new Date(startDate);
      
      if (planType === 'MONTHLY') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      
      await prisma.subscription.create({
        data: {
          userId: order.userId,
          planType,
          status: 'ACTIVE',
          startDate,
          endDate,
          autoRenew: true
        }
      });
      
      return NextResponse.json({ success: true });
    } else if (tradeStatus === 'FAILED' || tradeStatus === 'EXPIRED') {
      // Update order status
      await prisma.order.update({
        where: { id: `order_${orderId}` },
        data: { status: 'FAILED' }
      });
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Binance Pay webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}