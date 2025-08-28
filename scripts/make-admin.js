const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeAdmin(email) {
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log(`User with email ${email} not found`);
      return;
    }

    // Update the user's role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });

    console.log(`User ${updatedUser.email} has been made an admin`);
  } catch (error) {
    console.error('Error making user admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.log('Please provide an email address');
  process.exit(1);
}

makeAdmin(email);