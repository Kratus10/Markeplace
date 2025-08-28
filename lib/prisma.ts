import { PrismaClient } from '@prisma/client';

// Declare a global variable for PrismaClient in development to avoid
// creating new instances during hot-reloading
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Ensure we only instantiate PrismaClient once
const prismaClient = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error']
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prismaClient;
}

// Export only the client instance, not the Prisma class
export const prisma = prismaClient;
