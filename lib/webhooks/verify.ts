import { IncomingMessage } from 'http';
import { buffer } from 'micro';
import crypto from 'crypto';

// Replace with your actual webhook secrets
const WEBHOOK_SECRET_STRIPE = process.env.WEBHOOK_SIGNING_KEYS__STRIPE;
const WEBHOOK_SECRET_BINANCE_PAY = process.env.BINANCE_PAY_WEBHOOK_SECRET;

interface VerificationResult {
  ok: boolean;
  reason?: string;
  providerEventId?: string;
}

/**
 * Verifies a Stripe webhook signature.
 * @param req The NextApiRequest object.
 * @returns A promise that resolves to a VerificationResult.
 */
export async function verifyStripe(req: IncomingMessage): Promise<VerificationResult> {
  if (!WEBHOOK_SECRET_STRIPE) {
    return { ok: false, reason: 'Stripe webhook secret not configured.' };
  }

  const signature = (req.headers as Record<string, string>)['stripe-signature'];
  if (!signature) {
    return { ok: false, reason: 'Missing Stripe signature.' };
  }

  const rawBody = await buffer(req);
  const stripeEvent = JSON.parse(rawBody.toString());

  try {
    // Use the Stripe SDK for verification if available, otherwise use manual verification
    // For this example, we'll use manual verification
    const signedPayload = signature.split(',')[1].split('=')[1];
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET_STRIPE)
      .update(`${signature.split(',')[0].split('=')[1]}.${rawBody.toString()}`)
      .digest('hex');

    if (signedPayload !== expectedSignature) {
      return { ok: false, reason: 'Invalid Stripe signature.' };
    }

    return { ok: true, providerEventId: stripeEvent.id };
  } catch (err) {
    return { ok: false, reason: `Error verifying Stripe signature: ${err.message}` };
  }
}

/**
 * Verifies a Binance Pay webhook signature.
 * @param req The NextApiRequest object.
 * @returns A promise that resolves to a VerificationResult.
 */
export async function verifyBinancePay(req: NextApiRequest): Promise<VerificationResult> {
  if (!WEBHOOK_SECRET_BINANCE_PAY) {
    return { ok: false, reason: 'Binance Pay webhook secret not configured.' };
  }

  const signature = req.headers['binancepay-signature'] as string;
  if (!signature) {
    return { ok: false, reason: 'Missing Binance Pay signature.' };
  }

  const rawBody = await buffer(req);
  const payload = JSON.parse(rawBody.toString());

  try {
    const expectedSignature = crypto
      .createHmac('sha512', WEBHOOK_SECRET_BINANCE_PAY)
      .update(rawBody.toString())
      .digest('hex');

    if (signature !== expectedSignature) {
      return { ok: false, reason: 'Invalid Binance Pay signature.' };
    }

    return { ok: true, providerEventId: payload.bizId };
  } catch (err) {
    return { ok: false, reason: `Error verifying Binance Pay signature: ${err.message}` };
  }
}
