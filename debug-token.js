const { PrismaClient } = require('@prisma/client');
const { getToken } = require('next-auth/jwt');
const { createMocks } = require('node-mocks-http');

const prisma = new PrismaClient();

// Mock request object
const { req } = createMocks({
  method: 'GET',
  headers: {
    'authorization': 'Bearer test-token'
  }
});

async function debugToken() {
  try {
    console.log('Debugging token...');
    
    // First, let's check the user in the database
    const email = 'justineforever@ymail.com';
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      console.log(`User not found with email: ${email}`);
      return;
    }

    console.log(`User in database: ID=${user.id}, Email=${user.email}, Role=${user.role}`);
    
    // Note: We can't actually test the token without a real session
    console.log('\nNOTE: To fully debug the token issue, we would need to:');
    console.log('1. Log in to the application');
    console.log('2. Check the browser console for the session token');
    console.log('3. Decode the JWT to verify the role field');
    
  } catch (error) {
    console.error('Error debugging token:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugToken();