import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // User details
    const email = 'justineforever@ymail.com';
    const password = 'testing12345';
    const username = 'Kratus';
    const name = 'Kratus';
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json({ message: `User with email ${email} already exists` });
    }
    
    // Check if username is already taken
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    
    if (existingUsername) {
      return NextResponse.json({ message: `Username ${username} is already taken` });
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        username,
        password: hashedPassword,
        role: 'USER',
      },
    });
    
    return NextResponse.json({ 
      message: 'Test user created successfully',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name
      }
    });
    
  } catch (error) {
    console.error('Error creating test user:', error);
    return NextResponse.json({ error: 'Failed to create test user' }, { status: 500 });
  }
}