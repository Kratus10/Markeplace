import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { adminMiddleware } from '@/lib/middleware/adminMiddleware';

export async function POST(req: Request) {
  // Check admin authorization
  const authResponse = await adminMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  try {
    const formData = await req.formData();
    const title = formData.get('title') as string;
    const symbol = formData.get('symbol') as string;
    const action = formData.get('action') as string;
    const entry = formData.get('entry') as string;
    const takeProfit = formData.get('takeProfit') as string;
    const stopLoss = formData.get('stopLoss') as string;
    const confidence = formData.get('confidence') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const image = formData.get('image') as File | null;

    // Validate input
    if (!title || !symbol || !action || !entry || !takeProfit || !stopLoss || !confidence || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Process image if provided
    let imageUrl = null;
    if (image) {
      // In a real implementation, you would upload this to a storage service like R2
      // For now, we'll just save the image name as a placeholder
      imageUrl = `/images/signals/${Date.now()}-${image.name}`;
    }

    // Save to database
    const session = await getServerSession(authOptions);
    const newSignal = await prisma.tradingSignal.create({
      data: {
        title,
        symbol,
        action,
        entry,
        takeProfit,
        stopLoss,
        confidence,
        description: description || '',
        content: imageUrl ? `${content}<img src="${imageUrl}" alt="Signal chart" class="mt-4" />` : content,
        userId: session!.user.id
      }
    });

    // Transform the data to match the expected format
    const formattedSignal = {
      id: newSignal.id,
      title: newSignal.title,
      symbol: newSignal.symbol,
      action: newSignal.action,
      entry: newSignal.entry,
      takeProfit: newSignal.takeProfit,
      stopLoss: newSignal.stopLoss,
      confidence: newSignal.confidence,
      description: newSignal.description || '',
      content: newSignal.content,
      createdAt: newSignal.createdAt.toISOString(),
      updatedAt: newSignal.updatedAt.toISOString()
    };

    return NextResponse.json({
      success: true,
      data: formattedSignal,
      message: 'Signal created successfully'
    });
  } catch (error) {
    console.error('Create Signal API error:', error);
    return NextResponse.json(
      { error: 'Failed to create signal' },
      { status: 500 }
    );
  }
}