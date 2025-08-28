import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// Validate required environment variables
const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const R2_ENDPOINT = getRequiredEnv('R2_ENDPOINT');
const R2_ACCESS_KEY_ID = getRequiredEnv('R2_ACCESS_KEY_ID');
const R2_SECRET_ACCESS_KEY = getRequiredEnv('R2_SECRET_ACCESS_KEY');
const R2_BUCKET = getRequiredEnv('R2_BUCKET');

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

interface CreatePresignedUrlArgs {
  uploadId: string;
  contentType: string;
  size: number;
  userId?: string;
}

export async function createPresignedUrl({
  uploadId,
  contentType,
  size,
  userId,
}: CreatePresignedUrlArgs) {
  const key = `uploads/tmp/${uploadId}/${uuidv4()}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
    ContentLength: size,
    Metadata: {
      'upload-id': uploadId,
      ...(userId && { 'user-id': userId }),
    },
  });

  const ttl = process.env.PRESIGN_PUT_TTL_SEC ? 
    parseInt(process.env.PRESIGN_PUT_TTL_SEC) : 600;
  
  const presignedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: ttl,
  });

  return { presignedUrl, key };
}
