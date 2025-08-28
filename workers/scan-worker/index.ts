import { prisma } from '@/lib/prisma';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { sniffFileType } from '@/lib/upload/scanners/file-type-sniff';
import { scanZip } from '@/lib/upload/scanners/unzip-scan';
import { analyzeCode } from '@/lib/upload/scanners/static-code-analyzer';
import { markApproved, markQuarantined } from '@/lib/upload/quarantine';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

async function processScan(uploadId: string) {
  const upload = await prisma.upload.findUnique({ where: { id: uploadId } });
  if (!upload) {
    console.error(`Upload not found: ${uploadId}`);
    return;
  }

  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: upload.storageKey,
  });

  const { Body } = await s3Client.send(getObjectCommand);
  if (!Body || !(Body instanceof Readable)) {
    throw new Error('Failed to fetch object from storage');
  }

  const buffer = await streamToBuffer(Body);

  // 1. Sniff MIME type
  const detectedMime = await sniffFileType(buffer);
  if (detectedMime !== upload.detectedMime) {
    await markQuarantined(upload.id, `MIME type mismatch: declared=${upload.detectedMime}, detected=${detectedMime}`);
    return;
  }

  // 2. Scan based on file type
  let isSuspicious = false;
  let reason = '';

  if (detectedMime?.startsWith('application/zip')) {
    const result = await scanZip(buffer);
    isSuspicious = result.isSuspicious;
    reason = result.reason;
  } else if (detectedMime?.startsWith('text/')) {
    // A simple example for script files
    const result = await analyzeCode(buffer.toString('utf-8'));
    isSuspicious = result.isSuspicious;
    reason = result.reason;
  }

  // 3. VirusTotal scan (placeholder)
  // TODO: Integrate with VirusTotal API

  // 4. Update status
  if (isSuspicious) {
    await markQuarantined(upload.id, reason);
  } else {
    await markApproved(upload.id);
  }

  console.log(`Scan complete for upload ${upload.id}`);
}

// This is a placeholder for a proper queueing system (e.g., BullMQ, Upstash QStash)
async function main() {
  const pendingScans = await prisma.upload.findMany({
    where: { status: 'PENDING_SCAN' },
  });

  for (const scan of pendingScans) {
    await processScan(scan.id);
  }
}

main().catch(console.error);
