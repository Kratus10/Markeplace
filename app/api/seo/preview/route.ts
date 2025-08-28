
import { NextResponse } from 'next/server';
import { getSeoForPage } from '@/lib/seo/getSeoForPage';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json({ message: 'Path parameter is required' }, { status: 400 });
  }

  // In a real app, you might want to add more validation for the path

  try {
    const seoData = await getSeoForPage(path);
    return NextResponse.json(seoData);
  } catch (error) {
    console.error(`Error fetching SEO data for ${path}:`, error);
    return NextResponse.json({ message: 'Error fetching SEO data', error }, { status: 500 });
  }
}
