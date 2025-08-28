const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Connected to database successfully');
    
    // Try to query the database
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} users`);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Database connection error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();