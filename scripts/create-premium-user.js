const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create a premium user
  const user = await prisma.user.upsert({
    where: { email: 'premium@example.com' },
    update: {},
    create: {
      email: 'premium@example.com',
      name: 'Premium User',
      role: 'ADMIN' // Using ADMIN role to test access to signals
    }
  });

  console.log('Premium user created:', user);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
