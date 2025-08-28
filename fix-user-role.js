const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixUserRoles() {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true },
    });

    let updatedCount = 0;

    for (const user of users) {
      const currentRole = user.role;
      const uppercaseRole = currentRole.toUpperCase();

      if (currentRole !== uppercaseRole) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: uppercaseRole },
        });
        console.log(`Updated user ${user.email} from role '${currentRole}' to '${uppercaseRole}'`);
        updatedCount++;
      }
    }

    if (updatedCount > 0) {
      console.log(`\nSuccessfully updated ${updatedCount} user(s) to have uppercase roles.`);
    } else {
      console.log("\nAll user roles are already in the correct uppercase format.");
    }
  } catch (error) {
    console.error("Error fixing user roles:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserRoles();
