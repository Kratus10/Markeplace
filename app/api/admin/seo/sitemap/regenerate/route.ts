import { NextResponse } from 'next/server';

export async function POST() {
  // Mock logic - in a real app, this would trigger a background job
  console.log('Sitemap regeneration triggered');

  // Respond quickly to the client
  return NextResponse.json({ message: 'Sitemap regeneration started' });
}