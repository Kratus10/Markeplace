const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUserRole() {
  try {
    const email = 'justineforever@ymail.com';
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      console.log(`User not found with email: ${email}`);
      return;
    }

    console.log(`User found: ID=${user.id}, Email=${user.email}, Role=${user.role}`);
    console.log(`NOTE: Expected role is 'OWNER'`);

    if (user.role !== 'OWNER') {
      console.log(`\nPROBLEM FOUND: User role is '${user.role}' but should be 'OWNER'`);
      console.log('SOLUTION: Run "npm run make-owner" to fix this user role');
    } else {
      console.log('\nUser role is correct');
    }
  } catch (error) {
    console.error('Error checking user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserRole();
