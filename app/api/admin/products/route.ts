// FILE: app/api/admin/products/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';
import { prisma } from '@/lib/prisma';
import { adminMiddleware } from '@/lib/middleware/adminMiddleware';

export async function GET(req: Request) {
  // Check admin authorization
  const authResponse = await adminMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const exportFormat = searchParams.get('format');
    
    // Handle export requests
    if (exportFormat) {
      const products = await prisma.product.findMany({
        include: {
          category: {
            select: {
              name: true
            }
          },
          user: {
            select: {
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Format data for export
      const exportData = products.map(product => ({
        'Product ID': product.id,
        'Name': product.name,
        'Slug': product.slug,
        'Description': product.description,
        'Price': `${(product.price / 100).toFixed(2)}`,
        'Currency': product.currency,
        'Category': product.category?.name || 'Uncategorized',
        'Status': product.status,
        'Created By': product.user?.email || 'N/A',
        'Created At': product.createdAt.toISOString(),
        'Updated At': product.updatedAt.toISOString()
      }));

      // Generate CSV
      if (exportFormat === 'csv') {
        const headers = Object.keys(exportData[0]).join(',');
        const rows = exportData.map(row => 
          Object.values(row).map(field => 
            `"${String(field).replace(/"/g, '""')}"`
          ).join(',')
        ).join('\n');
        
        const csv = `${headers}\n${rows}`;
        
        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="products-report-${new Date().toISOString().split('T')[0]}.csv"`
          }
        });
      }
      
      // For other formats, return JSON
      return NextResponse.json({ data: exportData });
    }

    // Get all products with category info
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Get all categories
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true
      }
    });
    
    return NextResponse.json({
      success: true,
      data: {
        products,
        categories
      }
    });
  } catch (error) {
    console.error('Admin Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  // Check admin authorization
  const authResponse = await adminMiddleware(req);
  if (authResponse) {
    return authResponse;
  }

  try {
    const session = await getServerSession(authOptions);
    const { name, description, price, categoryId, status } = await req.json();
    
    // Validate input
    if (!name || !description || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    
    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    });
    
    // If slug exists, append a number
    let finalSlug = slug;
    let counter = 1;
    while (existingProduct) {
      finalSlug = `${slug}-${counter}`;
      counter++;
      const check = await prisma.product.findUnique({
        where: { slug: finalSlug }
      });
      if (!check) break;
    }
    
    // Create product
    const product = await prisma.product.create({
      data: {
        id: `prod_${Date.now()}`,
        name,
        slug: finalSlug,
        description,
        price,
        categoryId: categoryId || null,
        status,
        userId: session?.user.id || ''
      }
    });
    
    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Admin Create Product API error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' }, 
      { status: 500 }
    );
  }
}