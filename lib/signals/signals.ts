import { prisma } from '@/lib/prisma';
import type { TradingSignal } from '@prisma/client';

export type Signal = TradingSignal;

export async function getCurrentSignal(): Promise<Signal | null> {
  try {
    const signal = await prisma.tradingSignal.findFirst({
      orderBy: { createdAt: 'desc' },
    });
    return signal;
  } catch (error) {
    console.error('Error fetching signal:', error);
    return null;
  }
}
