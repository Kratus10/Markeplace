import { PrismaClient } from '@prisma/client';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { prisma } from '@/lib/prisma';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const MAX_ATTEMPTS = parseInt(process.env.WEBHOOK_MAX_ATTEMPTS || '5', 10);
const BASE_DELAY = parseInt(process.env.WEBHOOK_RETRY_BASE_MS || '2000', 10);

export async function processWebhookEvent(webhookEventId: string) {
  const webhookEvent = await prisma.webhookEvent.findUnique({
    where: { id: webhookEventId },
  });

  if (!webhookEvent) {
    console.error(`WebhookEvent ${webhookEventId} not found`);
    return;
  }

  // Skip if already processed
  if (webhookEvent.status === 'PROCESSED') {
    return;
  }

  // Handle dead letters
  if (webhookEvent.status === 'DEAD_LETTER') {
    console.warn(`Skipping dead letter event: ${webhookEventId}`);
    return;
  }

  try {
    // Fetch raw payload from storage
    const getCommand = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: webhookEvent.rawPayloadKey,
    });
    const { Body } = await s3.send(getCommand);
    const rawBody = await Body?.transformToString();
    const payload = JSON.parse(rawBody || '{}');

    // Process based on provider
    switch (webhookEvent.provider) {
      case 'stripe':
        await handleStripeEvent(payload, webhookEvent);
        break;
      case 'binance-pay':
        await handleBinancePayEvent(payload, webhookEvent);
        break;
      default:
        console.error(`Unsupported provider: ${webhookEvent.provider}`);
        throw new Error('Unsupported provider');
    }

    // Mark as processed
    await prisma.webhookEvent.update({
      where: { id: webhookEventId },
      data: {
        status: 'PROCESSED',
        processedAt: new Date(),
      },
    });

  } catch (error) {
    console.error(`Error processing webhook event ${webhookEventId}:`, error);

    // Update attempt count and status
    const attempts = webhookEvent.attempts + 1;
    const status = attempts >= MAX_ATTEMPTS ? 'DEAD_LETTER' : 'RETRYING';

    await prisma.webhookEvent.update({
      where: { id: webhookEventId },
      data: {
        attempts,
        status,
        lastError: error.message,
      },
    });

    // Reschedule if needed
    if (status === 'RETRYING') {
      const delay = BASE_DELAY * Math.pow(2, attempts);
      setTimeout(() => processWebhookEvent(webhookEventId), delay);
    }
  }
}

async function handleStripeEvent(payload: any, webhookEvent: any) {
  // Implement Stripe-specific processing
  console.log('Processing Stripe event:', webhookEvent.providerEventId);
  // Add your Stripe event handling logic here
}

async function handleBinancePayEvent(payload: any, webhookEvent: any) {
  // Implement Binance Pay-specific processing
  console.log('Processing Binance Pay event:', webhookEvent.providerEventId);
  // Add your Binance Pay event handling logic here
}
