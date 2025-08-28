import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth/helpers';

// Remove the UserRole type since we already have it defined in auth helpers

// Get all signals
export async function GET() {
  const session = await auth();
  
  if (!session || !session.user?.role || !isAdmin(session.user.role)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const signals = await prisma.tradingSignal.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    return NextResponse.json(signals);
  } catch (error) {
    console.error('Error fetching signals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new signal
export async function POST(request: Request) {
  const session = await auth();
  
  if (!session || !session.user?.role || !isAdmin(session.user.role)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const userId = session.user.id;

  try {
    // Parse form data
    const title = formData.get('title') as string;
    const symbol = formData.get('symbol') as string;
    const action = formData.get('action') as 'BUY' | 'SELL' | 'HOLD';
    const entry = formData.get('entry') as string;
    const takeProfit = formData.get('takeProfit') as string;
    const stopLoss = formData.get('stopLoss') as string;
    const confidence = formData.get('confidence') as 'High' | 'Medium' | 'Low';
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    
    // Handle image upload if present
    const image = formData.get('image') as File | null;
    let imageUrl = '';
    
    // In a real implementation, you would upload to S3/R2 here
    // For now, we'll just store the file name
    if (image) {
      imageUrl = image.name;
    }
    
    // Create signal in database
    const newSignal = await prisma.tradingSignal.create({
      data: {
        title,
        symbol,
        action,
        entry,
        takeProfit,
        stopLoss,
        confidence,
        description,
        content,
        userId: userId
      }
    });
    
    return NextResponse.json(newSignal, { status: 201 });
  } catch (error) {
    console.error('Error creating signal:', error);
    return NextResponse.json(
      { error: 'Failed to create signal' },
      { status: 500 }
    );
  }
}
