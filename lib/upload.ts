import { prisma } from '@/lib/prisma';
import { createPresignedUrl } from './upload/signer';

// Define the allowed file types and sizes for each upload kind
const UPLOAD_KIND_CONFIG = {
  avatar: {
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    maxSize: parseInt(process.env.MAX_AVATAR_SIZE_BYTES || '5242880'), // 5MB
  },
  product: {
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'video/mp4', 'application/pdf', 'application/epub+zip'],
    maxSize: parseInt(process.env.MAX_PRODUCT_ASSET_SIZE_BYTES || '209715200'), // 200MB
  },
  doc: {
    allowedMimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
    maxSize: 52428800, // 50MB
  },
  script: {
    allowedMimeTypes: ['application/zip', 'application/x-zip-compressed', 'application/octet-stream'],
    maxSize: 104857600, // 100MB
  },
};

interface CreatePresignArgs {
  userId?: string;
  kind: keyof typeof UPLOAD_KIND_CONFIG;
  fileName: string;
  contentType: string;
  size: number;
  checksum?: string;
}

export async function createPresign({
  userId,
  kind,
  fileName,
  contentType,
  size,
}: CreatePresignArgs) {
  const config = UPLOAD_KIND_CONFIG[kind];
  if (!config) {
    throw new Error('Invalid upload kind');
  }

  if (!config.allowedMimeTypes.includes(contentType)) {
    throw new Error(`Invalid content type for ${kind}: ${contentType}`);
  }

  if (size > config.maxSize) {
    throw new Error(`File size exceeds the limit for ${kind}: ${size} bytes`);
  }

  const presignExpires = new Date(Date.now() + (parseInt(process.env.PRESIGN_PUT_TTL_SEC || '600')) * 1000);

  const uploadIntent = await prisma.uploadIntent.create({
    data: {
      userId,
      kind,
      originalName: fileName,
      declaredType: contentType,
      declaredSize: size,
      presignExpires,
      status: 'PENDING_UPLOAD',
    },
  });

  const { presignedUrl, key } = await createPresignedUrl({
    uploadId: uploadIntent.id,
    contentType,
    size,
    userId,
  });

  return {
    uploadId: uploadIntent.id,
    presignedUrl,
    storageKey: key,
    expiresAt: presignExpires,
  };
}

interface CompleteUploadArgs {
  userId?: string;
  uploadId: string;
  storageKey: string;
  checksum?: string;
}

export async function completeUpload({
  userId,
  uploadId,
  storageKey,
  checksum,
}: CompleteUploadArgs) {
  const uploadIntent = await prisma.uploadIntent.findUnique({
    where: { id: uploadId },
  });

  if (!uploadIntent) {
    throw new Error('Upload intent not found');
  }

  // TODO: Verify object exists in storage and size matches
  // TODO: Sniff MIME type
  // TODO: Verify checksum

  const upload = await prisma.upload.create({
    data: {
      uploadIntentId: uploadIntent.id,
      userId: uploadIntent.userId,
      storageKey,
      size: uploadIntent.declaredSize || 0,
      detectedMime: uploadIntent.declaredType,
      sha256: checksum,
      status: 'PENDING_SCAN', // Always queue for scanning
    },
  });

  // TODO: Enqueue scan-worker job

  return { ok: true, status: upload.status };
}

interface CancelUploadArgs {
  userId?: string;
  uploadId: string;
}

export async function cancelUpload({ userId, uploadId }: CancelUploadArgs) {
  const uploadIntent = await prisma.uploadIntent.update({
    where: { id: uploadId },
    data: { status: 'CANCELLED' },
  });

  // TODO: Delete partial object from storage if it exists

  return { ok: true };
}

export async function getUploadStatus(uploadId: string) {
  const upload = await prisma.upload.findFirst({
    where: { uploadIntentId: uploadId },
    orderBy: { createdAt: 'desc' },
  });

  if (upload) {
    return { status: upload.status };
  }

  const uploadIntent = await prisma.uploadIntent.findUnique({
    where: { id: uploadId },
  });

  return { status: uploadIntent?.status || 'NOT_FOUND' };
}
