import { prisma } from '@/lib/prisma';
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

async function moveObject(sourceKey: string, destinationKey: string) {
  const copyCommand = new CopyObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    CopySource: `${process.env.R2_BUCKET!}/${sourceKey}`,
    Key: destinationKey,
  });
  await s3Client.send(copyCommand);

  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET!,
    Key: sourceKey,
  });
  await s3Client.send(deleteCommand);
}

export async function markQuarantined(uploadId: string, reason: string) {
  const upload = await prisma.upload.update({
    where: { id: uploadId },
    data: { status: 'QUARANTINED' },
  });

  const destinationKey = `uploads/quarantine/${upload.storageKey.split('/').slice(2).join('/')}`;
  await moveObject(upload.storageKey, destinationKey);

  // TODO: Create forensic export payload
  // TODO: Enqueue admin notifications and AuditLog entries

  return { ok: true };
}

export async function markApproved(uploadId: string) {
  const upload = await prisma.upload.update({
    where: { id: uploadId },
    data: { status: 'APPROVED' },
  });

  const destinationKey = `uploads/public/${upload.storageKey.split('/').slice(2).join('/')}`;
  await moveObject(upload.storageKey, destinationKey);

  return { ok: true };
}

export async function markRejected(uploadId: string) {
  const upload = await prisma.upload.update({
    where: { id: uploadId },
    data: { status: 'REJECTED' },
  });

  // Note: We keep the object in quarantine for forensic purposes
  // A separate process will handle retention and deletion

  return { ok: true };
}
