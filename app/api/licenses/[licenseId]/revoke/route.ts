import { getServerSession } from "@/lib/auth/getSession";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { licenseId: string } }
) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const licenseId = params.licenseId;
  if (!licenseId) {
    return NextResponse.json({ error: 'License ID is required' }, { status: 400 });
  }

  try {
    // Get license with product ownership info
    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: { product: { select: { userId: true } } }
    });

    if (!license) {
      return NextResponse.json({ error: 'License not found' }, { status: 404 });
    }

    // Check if current user is product owner or admin
    if (
      session.user.id !== license.product.userId && 
      session.user.role !== 'ADMIN'
    ) {
      return NextResponse.json(
        { error: 'Insufficient permissions' }, 
        { status: 403 }
      );
    }

    // Revoke the license
    await prisma.license.update({
      where: { id: licenseId },
      data: { revokedAt: new Date() }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' }, 
      { status: 500 }
    );
  }
}
