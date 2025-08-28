import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create initial owner account
  const ownerEmail = 'owner@example.com';
  const ownerPassword = 'Chang3M3!'; // In production, use a secure password
  
  // Create or update owner user
  await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {},
    create: {
      email: ownerEmail,
      name: 'Site Owner',
      password: ownerPassword, // In practice, this should be hashed
      role: 'OWNER',
      kycVerified: true,
    },
  });

  // Create initial site settings
  await prisma.siteSettings.upsert({
    where: { id: 'default-settings' },
    update: {},
    create: {
      id: 'default-settings',
      featuredProducts: [],
      trendingTopics: [],
      defaultSubscriptionMonthly: 500,
      defaultSubscriptionYearly: 4800,
    },
  });

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
