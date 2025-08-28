import { prisma } from '@/lib/prisma';
import type { Order } from '@prisma/client';
import { parseEther } from 'ethers';
import { getEtherscanProvider } from '@/lib/blockchain';

const MANUAL_CRYPTO_ENABLED = process.env.MANUAL_CRYPTO_ENABLED === 'true';
const REQUIRED_CONFIRMATIONS = parseInt(process.env.CRYPTO_CONFIRMATIONS || '12');

interface ManualPaymentOptions {
  orderId: string;
  currency: string;
  amountCents: number;
}

interface DepositAddressDetails {
  address: string;
  memo?: string;
  currency: string;
  amount: number;
}

export async function assignDepositAddress(orderId: string): Promise<DepositAddressDetails> {
  if (!MANUAL_CRYPTO_ENABLED) {
    throw new Error('Manual crypto payments are disabled');
  }

  // This would typically interface with a custodial service to generate a unique address
  // For now, we'll use environment-configured addresses with order-specific memos
  let address = '';
  let currency = 'USDT';

  switch (currency) {
    case 'USDT':
      address = process.env.DEPOSIT_ADDR_USDT || '';
      break;
    case 'BTC':
      address = process.env.DEPOSIT_ADDR_BTC || '';
      break;
    case 'ETH':
      address = process.env.DEPOSIT_ADDR_ETH || '';
      break;
    default:
      throw new Error('Unsupported currency for manual payment');
  }

  if (!address) {
    throw new Error('Deposit address not configured for this currency');
  }

  // Update order with deposit address and set status to AWAITING_PAYMENT
  await prisma.order.update({
    where: { id: orderId },
    data: {
      depositAddress: address,
      status: 'AWAITING_PAYMENT',
      paymentMethod: 'manual'
    }
  });

  return {
    address,
    memo: `ORDER:${orderId}`,
    currency,
    amount: 0 // Amount is determined at time of payment
  };
}

export async function verifyManualPayment(order: Order): Promise<boolean> {
  if (!MANUAL_CRYPTO_ENABLED) {
    throw new Error('Manual crypto payments are disabled');
  }

  if (!order.depositAddress || !order.txHash) {
    return false;
  }

  // Get appropriate blockchain provider based on currency
  const provider = getEtherscanProvider(order.currency);
  
  try {
    // Get transaction details
    const tx = await provider.getTransaction(order.txHash);
    if (!tx) return false;

    // Get transaction receipt to check confirmations
    const receipt = await provider.getTransactionReceipt(order.txHash);
    
    // Convert cents to token amount (assuming 1 USD = 1 USDT, 1 ETH = 100 USD, etc.)
    const amount = order.amountCents / 100;
    const weiAmount = parseEther(amount.toString());
    
    // Check if transaction meets requirements
    return (
      tx.to?.toLowerCase() === order.depositAddress.toLowerCase() &&
      tx.value === weiAmount &&
      receipt.confirmations >= REQUIRED_CONFIRMATIONS
    );
  } catch (error) {
    console.error('Error verifying manual payment:', error);
    return false;
  }
}

export async function markManualPaymentVerified(
  orderId: string, 
  verifiedBy: string, 
  txHash: string
): Promise<void> {
  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: 'PAID',
      verifiedBy,
      txHash
    }
  });
}
