process.env.DATABASE_URL = 'postgresql://postgres:justine10@localhost:5432/postgres';

const { PrismaClient } = require('@prisma/client');

// Log the DATABASE_URL from environment
console.log('DATABASE_URL from env:', process.env.DATABASE_URL);

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

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