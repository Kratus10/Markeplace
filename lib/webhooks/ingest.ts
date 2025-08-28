import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';

// Validate required environment variables
const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

// Placeholder encryption function - replace with actual implementation
async function encryptPayload(data: Buffer): Promise<Buffer> {
  // In production, use KMS or other encryption service
  return data;
}

const AWS_REGION = getRequiredEnv('AWS_REGION');
const AWS_ACCESS_KEY_ID = getRequiredEnv('AWS_ACCESS_KEY_ID');
const AWS_SECRET_ACCESS_KEY = getRequiredEnv('AWS_SECRET_ACCESS_KEY');
const R2_BUCKET_NAME = getRequiredEnv('R2_BUCKET_NAME');

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Persists the raw webhook payload to R2 (or S3).
 * @param provider The webhook provider.
 * @param rawBody The raw request body.
 * @returns The R2/S3 key for the stored payload.
 */
export async function persistRawPayload(
  provider: string,
  rawBody: Buffer,
  meta: Record<string, any>
): Promise<string> {
  const key = `webhooks/raw/${provider}/${new Date().toISOString().split('T')[0]}/${randomUUID()}.json.enc`;
  
    // Encrypt the payload using KMS or server-side encryption
    // For now, we'll use a placeholder for encryption
    // In production, replace with actual encryption logic
    const encryptedPayload = await encryptPayload(rawBody);

    await s3.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: encryptedPayload,
      ContentType: 'application/octet-stream', // Use octet-stream for encrypted data
    }));

  return key;
}

/**
 * Creates a redacted preview of the webhook payload.
 * @param rawJson The raw JSON payload.
 * @returns The redacted JSON payload.
 */
export function redactForPreview(rawJson: any): any {
  const redacted = { ...rawJson };
  
  // Mask sensitive fields
  if (redacted.email) {
    redacted.email = redacted.email.replace(/(.{2}).+(.{2}@.+)/, '$1***$2');
  }
  if (redacted.card) {
    redacted.card = redacted.card.replace(/\d(?=\d{4})/g, '*');
  }
  if (redacted.token) {
    redacted.token = redacted.token.substring(0, 8) + '***';
  }
  
  return redacted;
}

/**
 * Creates a new WebhookEvent row in the database.
 * @param provider The webhook provider.
 * @param providerEventId The provider's event ID.
 * @param idempotencyKey The idempotency key.
 * @param rawPayloadKey The R2/S3 key for the raw payload.
 * @param redactedPreview The redacted preview of the payload.
 * @param signatureValid Whether the signature is valid.
 * @returns The created WebhookEvent.
 */
export async function createWebhookEventRow(
  provider: string,
  providerEventId: string | null,
  idempotencyKey: string | null,
  rawPayloadKey: string,
  redactedPreview: any,
  signatureValid: boolean
) {
  return await prisma.webhookEvent.create({
    data: {
      provider,
      providerEventId,
      idempotencyKey,
      rawPayloadKey,
      redactedPreview,
      signatureValid,
      status: 'RECEIVED',
    },
  });
}

/**
 * Enqueues a webhook job for processing.
 * @param webhookEventId The ID of the webhook event.
 */
export async function enqueueWebhookJob(webhookEventId: string) {
  // In a real implementation, this would enqueue a job in your queue system
  // For this example, we'll use a simple fetch to a worker endpoint
  await fetch(`${process.env.WORKER_URL}/webhook-processor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ webhookEventId }),
  });
}
