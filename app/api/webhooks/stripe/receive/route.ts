import { NextRequest } from 'next/server';
import { verifyStripe } from '@/lib/webhooks/verify';
import { toIncomingMessage } from '@/lib/webhooks/request-utils';
import { 
  persistRawPayload,
  redactForPreview,
  createWebhookEventRow,
  enqueueWebhookJob
} from '@/lib/webhooks/ingest';

export async function POST(req: NextRequest) {
  try {
    // Convert NextRequest to IncomingMessage
    const incomingReq = toIncomingMessage(req);
    const verification = await verifyStripe(incomingReq);
    if (!verification.ok) {
      return new Response(verification.reason, { status: 401 });
    }

    // Read and parse the raw body
    const rawBody = await req.text();
    const body = JSON.parse(rawBody);
    
    // Persist raw payload
    const rawPayloadKey = await persistRawPayload('stripe', Buffer.from(rawBody), body);
    
    // Create redacted preview
    const redactedPreview = redactForPreview(body);
    
    // Create database record
    const webhookEvent = await createWebhookEventRow(
      'stripe',
      verification.providerEventId,
      body.idempotency_key,
      rawPayloadKey,
      redactedPreview,
      true
    );
    
    // Enqueue for processing
    await enqueueWebhookJob(webhookEvent.id);

    return new Response('Webhook received', { status: 200 });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
