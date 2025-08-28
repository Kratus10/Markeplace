import { NextResponse } from 'next/server';
import { createPresign } from '@/lib/upload';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

const presignSchema = z.object({
  fileName: z.string(),
  contentType: z.string(),
  size: z.number().int().positive(),
  kind: z.enum(['avatar', 'product', 'doc', 'script']),
  checksum: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // Note: For some upload kinds, you might allow anonymous uploads.
    // This example assumes authentication is required.
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const body = presignSchema.parse(json);

    const { fileName, contentType, size, kind, checksum } = body;
    const data = await createPresign({
      userId: session.user.id,
      fileName,
      contentType,
      size,
      kind,
      checksum,
    });

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
