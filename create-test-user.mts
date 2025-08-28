import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // User details
    const email = 'justineforever@ymail.com';
    const password = 'testing12345';
    const username = 'Kratus';
    const name = 'Kratus';
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      console.log(`User with email ${email} already exists`);
      return;
    }
    
    // Check if username is already taken
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    
    if (existingUsername) {
      console.log(`Username ${username} is already taken`);
      return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create the user
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

createTestUser();