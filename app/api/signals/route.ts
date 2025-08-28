// FILE: app/api/signals/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { subscriptionMiddleware } from '@/lib/middleware/subscriptionMiddleware';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user is admin (admins should have access to everything)
  const isAdmin = session.user.role === 'ADMIN_L1' || 
                  session.user.role === 'ADMIN_L2' || 
                  session.user.role === 'OWNER';
  
  // Validate subscription for non-admin users
  if (!isAdmin) {
    const subscriptionResponse = await subscriptionMiddleware(req);
    if (subscriptionResponse) {
      return subscriptionResponse;
    }
  }

  try {
    // Get the most recent trading signal from database
    const signal = await prisma.tradingSignal.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (!signal) {
      return NextResponse.json({
        success: true,
        data: null
      });
    }
    
    // Transform the data to match the expected format
    const formattedSignal = {
      id: signal.id,
      title: signal.title,
      symbol: signal.symbol,
      action: signal.action,
      entry: signal.entry,
      takeProfit: signal.takeProfit,
      stopLoss: signal.stopLoss,
      confidence: signal.confidence,
      description: signal.description || '',
      content: signal.content,
      createdAt: signal.createdAt.toISOString(),
      updatedAt: signal.updatedAt.toISOString()
    };
    
    return NextResponse.json({
      success: true,
      data: formattedSignal
    });
  } catch (error) {
    console.error('Signals API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signals' }, 
      { status: 500 }
    );
  }
}

// Admin endpoint to create new signals
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and is admin
  const isAdmin = session?.user.role === 'ADMIN_L1' || 
                  session?.user.role === 'ADMIN_L2' || 
                  session?.user.role === 'OWNER';
  
  if (!session || !isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, symbol, action, entry, takeProfit, stopLoss, confidence, description, content } = await req.json();
    
    // Validate input
    if (!title || !symbol || !action || !entry || !takeProfit || !stopLoss || !confidence || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Save to database
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
        content,
        userId: session.user.id
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