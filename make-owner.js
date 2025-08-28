const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeOwner(email) {
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log(`User with email ${email} not found`);
      return;
    }

    // Update the user's role to OWNER
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'OWNER' }
    });

    console.log(`User ${updatedUser.email} has been made an owner`);
    console.log(`New role: ${updatedUser.role}`);
  } catch (error) {
    console.error('Error making user owner:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2] || 'justineforever@ymail.com';

makeOwner(email);