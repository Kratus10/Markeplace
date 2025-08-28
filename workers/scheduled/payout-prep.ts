import { prisma } from '@/lib/prisma';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { format } from 'date-fns';

export async function runPayoutPrep() {
  const jobName = 'payout-prep';
  const jobStart = new Date();
  let status = 'SUCCESS';
  let log = '';

  try {
    // Calculate payout period (bi-monthly)
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get eligible users and their earnings
    const earnings = await prisma.earningsLedger.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        status: 'EARNED',
        user: {
          kycVerified: true
        }
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            payoutAddress: true
          }
        }
      }
    });

    // Group earnings by user
    const userEarnings = new Map<string, {username: string | null, payoutAddress: string | null, amount: number}>();
    for (const earning of earnings) {
      const userId = earning.userId;
      if (!userEarnings.has(userId)) {
        userEarnings.set(userId, {
          username: earning.user.username,
          payoutAddress: earning.user.payoutAddress,
          amount: 0
        });
      }
      userEarnings.get(userId)!.amount += earning.amountCents;
    }

    // Generate CSV content
    let csvContent = 'User ID,Username,Amount (cents),Payout Address\n';
    for (const [userId, data] of userEarnings) {
      if (data.amount > 0) {
        csvContent += `${userId},${data.username ?? ''},${data.amount},${data.payoutAddress ?? ''}\n`;
      }
    }

    // Upload CSV to R2
    const r2 = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT!,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
    
    const csvKey = `payouts/${format(jobStart, 'yyyy-MM')}.csv`;
    await r2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET!,
      Key: csvKey,
      Body: csvContent,
      ContentType: 'text/csv'
    }));

    log = `Generated payout CSV for ${userEarnings.size} users. File: ${csvKey}`;
  } catch (error) {
    status = 'FAILED';
    log = error instanceof Error ? error.message : 'Unknown error during payout preparation';
  }

  try {
    // Create job run record using raw SQL
    return await prisma.$queryRaw`
      INSERT INTO "JobRun" (id, "jobName", "startedAt", "finishedAt", status, log)
      VALUES (gen_random_uuid(), ${jobName}, ${jobStart}, NOW(), ${status}, ${log})
      RETURNING *
    `;
  } finally {
    await prisma.$disconnect();
  }
}

// Entry point for serverless execution
export default async function handler() {
  return runPayoutPrep();
}
