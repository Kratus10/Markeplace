import { prisma } from '@/lib/prisma';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const QUARANTINE_RETENTION_DAYS = parseInt(process.env.QUARANTINE_RETENTION_DAYS || '30', 10);

// Configure R2 client
const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT || '',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

export async function runQuarantineCleanup() {
  const jobName = 'quarantine-cleanup';
  const jobStart = new Date();
  let status = 'SUCCESS';
  let log = '';

  try {
    // Calculate retention cutoff date
    const retentionCutoff = new Date();
    retentionCutoff.setDate(retentionCutoff.getDate() - QUARANTINE_RETENTION_DAYS);

    // Find quarantined files beyond retention period
    const expiredUploads = await prisma.upload.findMany({
      where: {
        status: 'QUARANTINED',
        createdAt: { lt: retentionCutoff }
      }
    });

    let deletedCount = 0;
    let errorCount = 0;

    // Delete files from storage and DB
    for (const upload of expiredUploads) {
      try {
        // Delete from R2 storage
        await r2.send(new DeleteObjectCommand({
          Bucket: process.env.R2_BUCKET!,
          Key: upload.storageKey
        }));

        // Delete DB record
        await prisma.upload.delete({ where: { id: upload.id } });
        
        deletedCount++;
      } catch (error) {
        errorCount++;
        log += `Error deleting ${upload.id}: ${error instanceof Error ? error.message : 'Unknown error'}\n`;
      }
    }

    log += `Deleted ${deletedCount} files. ${errorCount} errors encountered.`;
  } catch (error) {
    status = 'FAILED';
    log = error instanceof Error ? error.message : 'Unknown error during quarantine cleanup';
  }

  try {
    // Create job run record using raw SQL
    const result = await prisma.$queryRaw`
      INSERT INTO "JobRun" (id, "jobName", "startedAt", "finishedAt", status, log)
      VALUES (gen_random_uuid(), ${jobName}, ${jobStart}, NOW(), ${status}, ${log})
      RETURNING *
    `;
    return result;
  } finally {
    await prisma.$disconnect();
  }
}

// Entry point for serverless execution
export default async function handler() {
  return runQuarantineCleanup();
}
