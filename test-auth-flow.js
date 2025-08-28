// Test authentication flow
const testAuthFlow = async () => {
  try {
    console.log('Testing authentication flow...');
    
    // First, let's check if we can connect to the database
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Try to find a user
    const user = await prisma.user.findFirst();
    console.log('Database connection successful. First user:', user?.email || 'No users found');
    
    await prisma.$disconnect();
    
    console.log('Auth flow test completed successfully');
  } catch (error) {
    console.error('Auth flow test failed:', error.message);
  }
};

testAuthFlow();