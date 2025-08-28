// FILE: scripts/make-admin.ts
import { prisma } from '@/lib/prisma';

async function makeAdmin(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      console.log(`User with email ${email} not found`);
      return;
    }
    
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });
    
    console.log(`User ${email} has been made an admin`);
  } catch (error) {
    console.error('Error making user admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('Please provide an email address as an argument');
  console.log('Usage: npm run make-admin user@example.com');
  process.exit(1);
}

makeAdmin(email);