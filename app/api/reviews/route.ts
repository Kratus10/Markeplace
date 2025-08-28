import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { getSession } from '@/lib/auth';
import { z } from 'zod';
import { marked } from 'marked';
import { sanitizeHtml } from '@/lib/utils/sanitizeHtml';

export const runtime = "nodejs"; // Use Node.js runtime to support Prisma

type Attachment = {
  id: string;
  url: string;
  thumbnailUrl: string;
  mimeType: string;
  size: number;
};

interface APIReview {
  id: string;
  userId: string;
  rating: number;
  body: string;
  createdAt: string;
  verifiedPurchase: boolean;
  attachments?: Attachment[] | null;
}

const reviewSchema = z.object({
  orderId: z.string().min(1),
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(100).optional(),
  body: z.string().min(20).max(5000),
  anonymous: z.boolean().default(false),
  attachments: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const productId = url.searchParams.get('productId');

  if (!productId) {
    return NextResponse.json(
      { error: 'productId parameter is required' },
      { status: 400 }
    );
  }

  try {
    // Replace with your Prisma query to fetch reviews
    const dbReviews = await prisma.review.findMany({
      where: { productId },
    });

    // Transform reviews to ensure dates are strings
    const reviews: APIReview[] = dbReviews.map((review: any) => ({
      id: review.id,
      userId: review.userId,
      rating: review.rating,
      body: review.body,
      createdAt: review.createdAt.toISOString(),
      verifiedPurchase: review.verifiedPurchase,
      attachments: review.attachments,
    }));

    return NextResponse.json(reviews, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('[REVIEWS_API_ERROR]', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// Existing POST handler remains unchanged
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!session.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }
    const userId = session.user.id;
    const data = await req.json();
    const parsed = reviewSchema.safeParse(data);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { orderId, productId, rating, title, body, anonymous, attachments } = parsed.data;

    // Handle attachments as JSON
    const attachmentsJson = attachments ? JSON.parse(JSON.stringify(attachments)) as Prisma.InputJsonValue : null;

    // Verify the order belongs to the user and is completed
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
        status: 'COMPLETED',
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found or not eligible for review' },
        { status: 400 }
      );
    }

    // Check for existing review for this order
    const existingReview = await prisma.review.findFirst({
      where: { orderId },
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'Review already submitted for this order' },
        { status: 400 }
      );
    }

    // Convert markdown to HTML and sanitize
    // Process HTML content
    // Process HTML content
    const bodyMarkdown = body;
    let bodyHtml = body;
    try {
      const rawHtml = await marked.parse(body);
      bodyHtml = await sanitizeHtml(rawHtml.toString()) as string;
    } catch (error) {
      console.error('Error processing HTML content:', error);
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        orderId,
        productId,
        userId,
        rating,
        title: title || '',
        body: bodyMarkdown,
        bodyHtml,
        anonymous,
        attachments: attachmentsJson,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('[REVIEW_SUBMISSION_ERROR]', error);
    return NextResponse.json(
      { error: 'An error occurred while submitting review' },
      { status: 500 }
    );
  }
}
