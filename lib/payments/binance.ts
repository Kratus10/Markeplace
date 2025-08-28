import { createHash, createHmac } from 'crypto';
import { prisma } from '@/lib/prisma';
import type { Order } from '@prisma/client';

const BINANCE_PAY_API_KEY = process.env.BINANCE_PAY_API_KEY;
const BINANCE_PAY_API_SECRET = process.env.BINANCE_PAY_API_SECRET;
const BINANCE_PAY_BASE_URL = process.env.BINANCE_PAY_BASE_URL || 'https://bpay.binanceapi.com';

if (!BINANCE_PAY_API_KEY || !BINANCE_PAY_API_SECRET) {
  throw new Error('Binance Pay API credentials are missing');
}

interface BinanceOrderParams {
  merchantTradeNo: string;
  totalFee: number;
  currency: string;
  productDetail: string;
}

interface BinanceOrderResponse {
  prepayId?: string;
  qrCode?: string;
  paymentUrl?: string;
  error?: string;
}

/**
 * Creates a Binance Pay order
 * @param order - The order from our system
 * @param productName - The name of the product being purchased
 * @returns Binance payment details or error
 */
export async function createBinanceOrder(order: Order, productName: string): Promise<BinanceOrderResponse> {
  try {
    // Generate or reuse merchantTradeNo
    let merchantTradeNo: string;
    const existingMapping = await prisma.paymentMapping.findUnique({
      where: { orderId: order.id }
    });

    if (existingMapping) {
      merchantTradeNo = existingMapping.merchantTradeNo;
    } else {
      merchantTradeNo = `TRADE_${order.id.replace('order_', '')}_${Date.now()}`;
      await prisma.paymentMapping.create({
        data: {
          orderId: order.id,
          merchantTradeNo
        }
      });
    }

    const payload = {
      merchantTradeNo,
      totalFee: order.amountCents / 100, // Convert cents to dollars
      currency: order.currency || 'USD',
      productDetail: productName,
      returnUrl: `${process.env.SITE_URL}/orders/${order.id}/success`,
      cancelUrl: `${process.env.SITE_URL}/orders/${order.id}/cancel`
    };

    const timestamp = Date.now();
    const nonce = createHash('md5').update(`${timestamp}`).digest('hex');
    const payloadString = JSON.stringify(payload);

    // Create signature
    // Ensure API secret is available for HMAC
    if (!BINANCE_PAY_API_SECRET) {
      throw new Error('Binance Pay API secret is missing');
    }
    
    const signature = createHmac('sha512', BINANCE_PAY_API_SECRET)
      .update(`${BINANCE_PAY_API_KEY}\n${timestamp}\n${nonce}\n${payloadString}\n`)
      .digest('hex');

    const response = await fetch(`${BINANCE_PAY_BASE_URL}/binancepay/openapi/v3/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'BinancePay-Timestamp': timestamp.toString(),
        'BinancePay-Nonce': nonce,
        'BinancePay-Certificate-SN': BINANCE_PAY_API_KEY!,
        'BinancePay-Signature': signature
      },
      body: payloadString
    });

    const data = await response.json();
    
    if (data.status === 'SUCCESS' && data.data) {
      return {
        prepayId: data.data.prepayId,
        qrCode: data.data.qrCode,
        paymentUrl: data.data.paymentUrl
      };
    } else {
      return { error: data.errorMessage || 'Failed to create Binance order' };
    }
  } catch (error) {
    console.error('Binance order creation error:', error);
    return { error: 'Internal server error' };
  }
}
