const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  
  try {
    // User details
    const email = 'test@example.com';
    const password = 'password123';
    const username = 'testuser';
    const name = 'Test User';
    
    // Delete existing test user if it exists
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create the user directly
    const user = await prisma.user.create({
      data: {
        email,
        name,
        username,
        password: hashedPassword,
        role: 'USER',
      },
    });
    
    console.log('Test user created successfully:');
    console.log(`ID: ${user.id}`);
    console.log(`Email: ${user.email}`);
    console.log(`Username: ${user.username}`);
    console.log(`Name: ${user.name}`);
    
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
