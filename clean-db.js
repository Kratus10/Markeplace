const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    // Delete all data from tables
    await prisma.profileVisibility.deleteMany();
    await prisma.user.deleteMany();
    
    console.log('Database cleaned successfully');
  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();