import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  try {
    const { stdout, stderr } = await execAsync('npx prisma generate');
    console.log('Prisma client generated successfully');
    console.log(stdout);
    if (stderr) console.error(stderr);
    process.exit(0);
  } catch (error) {
    console.error('Error generating Prisma client:');
    console.error(error);
    process.exit(1);
  }
}

main();
