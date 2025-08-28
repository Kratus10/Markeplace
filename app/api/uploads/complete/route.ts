import { NextResponse } from 'next/server';
import { completeUpload } from '@/lib/upload';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/authOptions';

const completeSchema = z.object({
  uploadId: z.string(),
  storageKey: z.string(),
  checksum: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await req.json();
    const body = completeSchema.parse(json);

    const { uploadId, storageKey, checksum } = body;
    const data = await completeUpload({
      userId: session.user.id,
      uploadId,
      storageKey,
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
