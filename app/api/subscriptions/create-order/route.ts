import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { createBinanceOrder } from '@/lib/payments/binance';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { planType, paymentMethod, cryptoCurrency } = await req.json();
    
    // Validate plan type
    if (!planType || (planType !== 'MONTHLY' && planType !== 'YEARLY')) {
      return NextResponse.json(
        { error: 'Invalid plan type. Must be MONTHLY or YEARLY' }, 
        { status: 400 }
      );
    }
    
    // Validate payment method
    if (!paymentMethod || (paymentMethod !== 'binance' && paymentMethod !== 'manual')) {
      return NextResponse.json(
        { error: 'Invalid payment method. Must be binance or manual' }, 
        { status: 400 }
      );
    }
    
    // Get plan prices from environment variables
    const monthlyPrice = parseInt(process.env.DEFAULT_SUBSCRIPTION_MONTHLY_CENTS || '500');
    const yearlyPrice = parseInt(process.env.DEFAULT_SUBSCRIPTION_YEARLY_CENTS || '4800');
    
    // Calculate price based on plan
    const priceInCents = planType === 'MONTHLY' ? monthlyPrice : yearlyPrice;
    
    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        productId: 'subscription', // Special product ID for subscriptions
        amountCents: priceInCents,
        currency: 'USD',
        status: 'PENDING',
        paymentMethod
      }
    });
    
    // Handle Binance Pay
    if (paymentMethod === 'binance') {
      const binanceResponse = await createBinanceOrder(order, `Premium ${planType} Subscription`);
      
      if (binanceResponse.error) {
        return NextResponse.json(
          { error: binanceResponse.error }, 
          { status: 500 }
        );
      }
      
      // Update order with Binance payment details
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentUrl: binanceResponse.paymentUrl,
          transactionId: binanceResponse.prepayId
        }
      });
      
      return NextResponse.json({
        success: true,
        data: {
          orderId: order.id,
          paymentUrl: binanceResponse.paymentUrl
        },
        message: 'Order created successfully'
      });
    }
    // Handle manual crypto payment
    else if (paymentMethod === 'manual') {
      // Get deposit address based on currency
      let depositAddress = '';
      switch (cryptoCurrency) {
        case 'USDT':
          depositAddress = process.env.DEPOSIT_ADDR_USDT || '';
          break;
        case 'BTC':
          depositAddress = process.env.DEPOSIT_ADDR_BTC || '';
          break;
        case 'ETH':
          depositAddress = process.env.DEPOSIT_ADDR_ETH || '';
          break;
        case 'BNB':
          depositAddress = process.env.DEPOSIT_ADDR_BNB || '';
          break;
        default:
          depositAddress = process.env.DEPOSIT_ADDR_USDT || '';
      }
      
      if (!depositAddress) {
        return NextResponse.json(
          { error: 'Deposit address not configured for this currency' }, 
          { status: 500 }
        );
      }
      
      // Update order with deposit address
      await prisma.order.update({
        where: { id: order.id },
        data: {
          depositAddress,
          status: 'AWAITING_PAYMENT'
        }
      });
      
      return NextResponse.json({
        success: true,
        data: {
          orderId: order.id,
          depositAddress
        },
        message: 'Order created successfully. Please send payment to the provided address.'
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid payment method' }, 
      { status: 400 }
    );
  } catch (error) {
    console.error('Create subscription order error:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription order' }, 
      { status: 500 }
    );
  }
}