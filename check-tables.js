const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTables() {
  try {
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('Database tables:');
    console.log(tables);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error checking tables:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkTables();
