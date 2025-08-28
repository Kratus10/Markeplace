import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const runtime = "nodejs"; // Use Node.js runtime to support Prisma

export async function POST(request: Request) {
  const session = await auth(request);
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return new NextResponse('Current password and new password are required', { status: 400 });
    }

    if (newPassword.length < 8) {
      return new NextResponse('New password must be at least 8 characters', { status: 400 });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        password: true,
      }
    });

    if (!user || !user.password) {
      return new NextResponse('User not found', { status: 404 });
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return new NextResponse('Current password is incorrect', { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword },
    });

    return new NextResponse('Password updated successfully', { status: 200 });
  } catch (error) {
    console.error('Error changing password:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}