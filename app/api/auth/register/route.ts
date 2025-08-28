import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createToken } from '@/lib/email/tokens';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validators/user';

export const runtime = "nodejs"; // Use Node.js runtime to support Prisma

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues }, 
        { status: 400 }
      );
    }

    const { email, password, username, displayName } = validation.data;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' }, 
        { status: 409 }
      );
    }
    
    // Check if username is already taken
    if (username) {
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });
      
      if (existingUsername) {
        return NextResponse.json(
          { error: 'Username is already taken' }, 
          { status: 409 }
        );
      }
    }
    
    // Validate password length
    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' }, 
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name: displayName || username || '',
        username: username || undefined,
        password: hashedPassword,
        role: 'USER',
        status: 'ACTIVE', // Explicitly set status to ACTIVE
      },
    });
    
    // Create email verification token
    const token = await createToken(user.id, 'VERIFY_EMAIL', 24 * 60 * 60); // 24 hours
    
    // In a real app, we would send an email here
    console.log(`Verification token for ${email}: ${token}`);
    
    return NextResponse.json({ 
      ok: true,
      userId: user.id
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
