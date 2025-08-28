import { NextRequest, NextResponse } from "next/server";
import { generatePresignedDownloadUrl } from "@/lib/downloads/signUrl";
import { getServerSession } from "@/lib/auth/getSession";
import { prisma } from '@/lib/prisma';

// Helper to get client IP from request
function getClientIP(req: NextRequest) {
  return req.headers.get('x-forwarded-for') || 
         req.headers.get('cf-connecting-ip') || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

export async function GET(
  req: NextRequest,
  { params }: { params: { licenseId: string } }
) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const licenseId = params.licenseId;
  if (!licenseId) {
    return NextResponse.json({ error: "License ID is required" }, { status: 400 });
  }

  try {
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: { product: true }
    });
    
    if (!license) throw new Error("License not found");
    
    // Generate presigned download URL
    const downloadUrl = await generatePresignedDownloadUrl(licenseId, license.productId);

    return NextResponse.json({ url: downloadUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
