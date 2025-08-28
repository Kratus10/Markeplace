const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const email = 'justineforever@ymail.com';
    const password = 'password123';
    const name = 'Admin User';
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      console.log(`User with email ${email} already exists`);
      // Update the user's role to ADMIN
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
      });
      console.log(`Updated user ${updatedUser.email} to admin role`);
      return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create the admin user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });
    
    console.log(`Admin user created with email: ${user.email}`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();