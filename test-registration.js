const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRegistration() {
  try {
    // Test data
    const testUser = {
      displayName: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    // Try to register the user
    console.log('Attempting to register user...');
    
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const text = await response.text();
    console.log('Registration response text:', text);
    console.log('Response status:', response.status);
    
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.log('Response is not JSON');
      result = { error: text };
    }
    
    if (response.ok) {
      console.log('Registration successful!');
      
      // Check if user was created in database
      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      
      if (user) {
        console.log('User found in database:', user);
        
        // Clean up - delete test user
        await prisma.user.delete({
          where: { email: testUser.email },
        });
        console.log('Test user cleaned up from database');
      }
    } else {
      console.log('Registration failed');
      
      // Check if user was partially created
      const user = await prisma.user.findUnique({
        where: { email: testUser.email },
      });
      
      if (user) {
        console.log('Cleaning up partially created user');
        await prisma.user.delete({
          where: { email: testUser.email },
        });
      }
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error during test:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testRegistration();
