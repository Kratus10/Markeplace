const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a test user first
  const user = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      name: 'Test Admin',
      role: 'ADMIN'
    }
  });

  // Create a test signal
  const signal = await prisma.tradingSignal.create({
    data: {
      title: 'EUR/USD Buy Signal',
      symbol: 'EUR/USD',
      action: 'BUY',
      entry: '1.0850',
      takeProfit: '1.0900',
      stopLoss: '1.0800',
      confidence: '85',
      description: 'Strong bullish momentum detected',
      content: '<p>Technical analysis shows a strong buy signal for EUR/USD at current levels.</p>',
      userId: user.id
    }
  });

  console.log('Test signal created:', signal);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
