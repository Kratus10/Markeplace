const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function applyMigration() {
  const prisma = new PrismaClient();
  
  try {
    // First apply cleanup
    const cleanupPath = path.join(__dirname, '../prisma/migrations/20250724000000_add_forum_models/cleanup.sql');
    const cleanupSql = fs.readFileSync(cleanupPath, 'utf8');
    const cleanupCommands = cleanupSql.split(';').filter(cmd => cmd.trim().length > 0);
    
    for (const command of cleanupCommands) {
      if (command.trim()) {
        await prisma.$executeRawUnsafe(command);
      }
    }
    console.log('Cleanup completed successfully!');
    
    // Now apply migration
    const sqlPath = path.join(__dirname, '../prisma/migrations/20250724000000_add_forum_models/migration.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    const commands = sql.split(';').filter(cmd => cmd.trim().length > 0);
    for (const command of commands) {
      if (command.trim()) {
        await prisma.$executeRawUnsafe(command);
      }
    }
    
    console.log('Forum tables created successfully!');
  } catch (error) {
    console.error('Error applying forum migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Rename main to applyMigration and call it
async function main() {
  await applyMigration();
}
main();
