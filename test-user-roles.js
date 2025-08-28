// Simple script to test the current user's role
const { PrismaClient } = require('@prisma/client');

async function testUserRole() {
  const prisma = new PrismaClient();
  
  try {
    // Find the user with OWNER role
    const ownerUser = await prisma.user.findFirst({
      where: {
        role: 'OWNER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });
    
    console.log('OWNER user in database:');
    console.log(ownerUser);
    
    // Find all users with ADMIN_L1 role
    const adminL1Users = await prisma.user.findMany({
      where: {
        role: 'ADMIN_L1'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });
    
    console.log('\nADMIN_L1 users in database:');
    console.log(adminL1Users);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserRole();