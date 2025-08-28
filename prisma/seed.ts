import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create categories for the forum
  const categories = [
    { id: '1', name: 'General Discussion', slug: 'general', description: 'General trading discussions', color: '#3b82f6', order: 0 },
    { id: '2', name: 'Market Analysis', slug: 'analysis', description: 'Market analysis and insights', color: '#10b981', order: 1 },
    { id: '3', name: 'Strategy Development', slug: 'strategy', description: 'Trading strategy discussions', color: '#8b5cf6', order: 2 },
    { id: '4', name: 'Technical Support', slug: 'support', description: 'Technical support for tools', color: '#f59e0b', order: 3 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }

  // Create a test user
  const hashedPassword = await bcrypt.hash('Password123!', 12);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      password: hashedPassword,
      role: 'USER',
    },
  });

  // Create a test admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN_L1',
    },
  });

  console.log('Seed data created successfully');
  console.log('Test user:', testUser.email, 'Password: Password123!');
  console.log('Admin user:', adminUser.email, 'Password: Password123!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });