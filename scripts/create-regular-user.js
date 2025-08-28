const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // Import bcryptjs
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 12); // Hash a default password

  // Create a regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {
      password: hashedPassword, // Update password if user already exists
    },
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: hashedPassword, // Set password for new user
      role: 'USER'
    }
  });

  console.log('Regular user created/updated:', user);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
