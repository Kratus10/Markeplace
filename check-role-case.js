const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserRoleCase() {
  try {
    const email = 'justineforever@ymail.com';
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      console.log(`User not found with email: ${email}`);
      return;
    }

    console.log(`User role details:`);
    console.log(`- Role value: "${user.role}"`);
    console.log(`- Role length: ${user.role.length}`);
    console.log(`- Role char codes: [${user.role.split('').map(c => c.charCodeAt(0)).join(', ')}]`);
    console.log(`- Role uppercase: "${user.role.toUpperCase()}"`);
    console.log(`- Role lowercase: "${user.role.toLowerCase()}"`);
    console.log(`- Role trimmed: "${user.role.trim()}"`);
    console.log(`- Is exactly "OWNER": ${user.role === "OWNER"}`);
    console.log(`- Is uppercase "OWNER": ${user.role.toUpperCase() === "OWNER"}`);
    
  } catch (error) {
    console.error('Error checking user role case:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserRoleCase();