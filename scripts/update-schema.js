// Script to update the database schema
// Run this after making changes to schema.prisma
console.log('Please run the following commands to update your database:');
console.log('1. npx prisma generate');
console.log('2. npx prisma migrate dev --name add_user_profile_fields');