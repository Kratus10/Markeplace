import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for profile visibility settings
const profileVisibilitySchema = z.object({
  showRole: z.boolean(),
  showLocation: z.boolean(),
  showOccupation: z.boolean(),
  showBirthday: z.boolean(),
  showTradingExperience: z.boolean(),
  showAvatar: z.boolean(),
});

// GET /api/user/profile-visibility - Fetch user's privacy settings
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find user's profile visibility settings
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        profileVisibility: {
          select: {
            showRole: true,
            showLocation: true,
            showOccupation: true,
            showBirthday: true,
            showTradingExperience: true,
            showAvatar: true,
          }
        }
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return default visibility settings if none exist
    const visibilitySettings = user.profileVisibility || {
      showRole: true,
      showLocation: true,
      showOccupation: true,
      showBirthday: true,
      showTradingExperience: true,
      showAvatar: true,
    };

    return NextResponse.json(visibilitySettings);

  } catch (error) {
    console.error('Error fetching profile visibility:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile-visibility - Update user's privacy settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate the request body
    const validationResult = profileVisibilitySchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const visibilityData = validationResult.data;

    // Find the user first to ensure they exist
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        id: true,
        profileVisibility: {
          select: { id: true }
        }
      }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let updatedVisibility;

    if (existingUser.profileVisibility) {
      // Update existing profile visibility record
      updatedVisibility = await prisma.profileVisibility.update({
        where: {
          id: existingUser.profileVisibility.id,
        },
        data: {
          ...visibilityData,
        },
      });
    } else {
      // Create new profile visibility record
      updatedVisibility = await prisma.profileVisibility.create({
        data: {
          ...visibilityData,
          userId: existingUser.id,
        },
      });
    }

    // Return the updated user data with the new visibility settings
    const updatedUser = await prisma.user.findUnique({
      where: { id: existingUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        profileVisibility: {
          select: {
            showRole: true,
            showLocation: true,
            showOccupation: true,
            showBirthday: true,
            showTradingExperience: true,
            showAvatar: true,
          }
        }
      }
    });

    return NextResponse.json({
      message: 'Privacy settings updated successfully',
      profileVisibility: updatedUser?.profileVisibility,
    });

  } catch (error) {
    console.error('Error updating profile visibility:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'Profile visibility settings not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/profile-visibility - Reset privacy settings to default
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        id: true,
        profileVisibility: {
          select: { id: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.profileVisibility) {
      // Reset to default values instead of deleting
      await prisma.profileVisibility.update({
        where: {
          id: user.profileVisibility.id,
        },
        data: {
          showRole: true,
          showLocation: true,
          showOccupation: true,
          showBirthday: true,
          showTradingExperience: true,
          showAvatar: true,
        },
      });
    } else {
      // Create default visibility settings
      await prisma.profileVisibility.create({
        data: {
          userId: user.id,
          showRole: true,
          showLocation: true,
          showOccupation: true,
          showBirthday: true,
          showTradingExperience: true,
          showAvatar: true,
        },
      });
    }

    return NextResponse.json({ 
      message: 'Privacy settings reset to default',
      profileVisibility: {
        showRole: true,
        showLocation: true,
        showOccupation: true,
        showBirthday: true,
        showTradingExperience: true,
        showAvatar: true,
      }
    });

  } catch (error) {
    console.error('Error resetting profile visibility:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
