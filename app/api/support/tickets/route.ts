import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ticketCreateSchema as SupportTicketCreateSchema } from '@/lib/validators/support';
import { reCAPTCHAAction, verifyReCAPTCHA } from '@/lib/auth/recaptcha';
import { auth } from '@/lib/auth/authOptions';
import { RateLimiter } from '@/lib/rateLimiter';
import { uploadFile } from '@/lib/upload';

const limiter = new RateLimiter({
  interval: 60 * 1000, // 1 minute
  maxRequests: 5,
  uniqueTokenPerInterval: 500,
});

export async function POST(req: NextRequest) {
  const ip = req.ip ?? req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  
  // Rate limit check
  const limit = await limiter.limit(ip);
  if (!limit.success) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const body = await req.json();
    const validation = SupportTicketCreateSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body', details: validation.error }, { status: 400 });
    }

    const { subject, message, attachmentIds, captchaToken, orderId } = validation.data;
    let userId: string | undefined;
    let submitterEmail: string;
    let submitterName: string | undefined;

    // Verify reCAPTCHA for guest submissions
    if (!captchaToken) {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized or invalid captcha' }, { status: 401 });
      }
      userId = session.user.id;
      submitterEmail = session.user.email!;
      submitterName = session.user.name;
    } else {
      const captchaValid = await verifyReCAPTCHA(captchaToken, reCAPTCHAAction.SUPPORT_TICKET);
      if (!captchaValid) {
        return NextResponse.json({ error: 'Invalid captcha token' }, { status: 401 });
      }
      if (!body.guestEmail) {
        return NextResponse.json({ error: 'Guest email is required' }, { status: 400 });
      }
      submitterEmail = body.guestEmail;
      submitterName = body.guestName;
    }

    // Create the support ticket
    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        orderId,
        submitterEmail,
        submitterName,
        subject,
        messages: [
          {
            authorId: userId,
            authorName: submitterName,
            authorRole: userId ? 'USER' : 'GUEST',
            body: message,
            timestamp: new Date().toISOString(),
            internal: false,
          },
        ],
        attachmentKeys: attachmentIds || [],
      },
    });

    return NextResponse.json({ ticketId: ticket.id }, { status: 201 });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return NextResponse.json(
      { error: 'Failed to create support ticket. Please try again.' },
      { status: 500 }
    );
  }
}
