const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugUser() {
  try {
    console.log('Debugging user role...');
    
    // Check the user in the database
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
    
    // Check if there are any other users with the OWNER role
    const owners = await prisma.user.findMany({
      where: { role: 'OWNER' },
      select: { id: true, email: true, role: true }
    });
    
    console.log(`\nAll users with OWNER role:`);
    owners.forEach(owner => {
      console.log(`- ID=${owner.id}, Email=${owner.email}, Role=${owner.role}`);
    });
    
  } catch (error) {
    console.error('Error debugging user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugUser();