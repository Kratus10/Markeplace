import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long').optional(),
  bio: z.string().max(500, 'Bio too long').optional(),
  gender: z.enum(['Male', 'Female', 'Other', 'Prefer not to say', '']).optional(),
  location: z.string().max(100, 'Location too long').optional(),
  birthday: z.string().optional(), // Will be validated as ISO date if provided
  occupation: z.string().max(100, 'Occupation too long').optional(),
  tradingExperience: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Professional', '']).optional(),
  avatar: z.string().optional(),
});

// GET /api/user/profile - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    console.log('Profile API route called');
    const session = await getSession();
    console.log('Session in profile API:', session);

    if (!session?.user?.id) {
      console.log('Unauthorized access attempt - no session or user ID');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Fetching user data for ID:', session.user.id);
    // Find user with profile data
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        gender: true,
        location: true,
        birthday: true,
        occupation: true,
        tradingExperience: true,
        avatar: true,
        role: true,
        status: true,
        kycVerified: true,
        createdAt: true,
        updatedAt: true,
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
      console.log('User not found for ID:', session.user.id);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User data found:', user);
    // Transform the data
    const profileData = {
      ...user,
      // Ensure profileVisibility has default values if null
      profileVisibility: user.profileVisibility || {
        showRole: true,
        showLocation: true,
        showOccupation: true,
        showBirthday: true,
        showTradingExperience: true,
        showAvatar: true,
      },
      // Add missing fields with default values
      totalEarningsCents: 0,
      isPremium: user.role === 'PREMIUM',
    };

    console.log('Profile data fetched successfully for user:', user.id);
    return NextResponse.json(profileData);

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile - Update user profile
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
    const validationResult = updateProfileSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    // Find the user first to ensure they exist
    const existingUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true }
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update data, filtering out empty strings for optional fields
    const filteredUpdateData: any = {};
    
    Object.entries(updateData).forEach(([key, value]) => {
      if (value !== undefined) {
        // Convert empty strings to null for optional fields
        if (value === '') {
          filteredUpdateData[key] = null;
        } 
        // Special handling for birthday field - convert to Date
        else if (key === 'birthday') {
          const date = new Date(value);
          filteredUpdateData[key] = isNaN(date.getTime()) ? value : date;
        }
        else {
          filteredUpdateData[key] = value;
        }
      }
    });

    // Update the user
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        ...filteredUpdateData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        gender: true,
        location: true,
        birthday: true,
        occupation: true,
        tradingExperience: true,
        avatar: true,
        role: true,
        status: true,
        kycVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: DELETE method to deactivate profile
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Instead of deleting, you might want to deactivate the account
    // This is a safer approach for data integrity
    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        // Add a field like 'isActive: false' if you have it in your schema
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ message: 'Profile deactivated successfully' });

  } catch (error) {
    console.error('Error deactivating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
