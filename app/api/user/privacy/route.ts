// FILE: app/api/user/privacy/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const privacySettings = await req.json();
    
    // Update user privacy settings
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        showRole: privacySettings.showRole ?? true,
        showLocation: privacySettings.showLocation ?? true,
        showOccupation: privacySettings.showOccupation ?? true,
        showBirthday: privacySettings.showBirthday ?? true,
        showTradingExperience: privacySettings.showTradingExperience ?? true,
        showAvatar: privacySettings.showAvatar ?? true
      }
    });
    
    return NextResponse.json({
      success: true,
      privacySettings: {
        showRole: updatedUser.showRole,
        showLocation: updatedUser.showLocation,
        showOccupation: updatedUser.showOccupation,
        showBirthday: updatedUser.showBirthday,
        showTradingExperience: updatedUser.showTradingExperience,
        showAvatar: updatedUser.showAvatar
      }
    });
  } catch (error) {
    console.error('Privacy settings update error:', error);
    return NextResponse.json(
      { error: 'Failed to update privacy settings' }, 
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get user privacy settings
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        showRole: true,
        showLocation: true,
        showOccupation: true,
        showBirthday: true,
        showTradingExperience: true,
        showAvatar: true
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      privacySettings: {
        showRole: user.showRole,
        showLocation: user.showLocation,
        showOccupation: user.showOccupation,
        showBirthday: user.showBirthday,
        showTradingExperience: user.showTradingExperience,
        showAvatar: user.showAvatar
      }
    });
  } catch (error) {
    console.error('Privacy settings fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch privacy settings' }, 
      { status: 500 }
    );
  }
}