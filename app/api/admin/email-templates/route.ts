import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/getCurrentUser';
import { EmailTemplateCreate, EmailTemplateSchema } from '@/lib/validators/emailTemplate';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templates = await prisma.emailTemplate.findMany({
      include: { versions: true }
    });

    return NextResponse.json({ data: templates });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'OWNER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: EmailTemplateCreate = await req.json();
    
    // Validate input
    if (!EmailTemplateSchema.safeParse(body).success) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    const newTemplate = await prisma.emailTemplate.create({
      data: {
        ...body,
        createdBy: user.id,
        versions: {
          create: {
            subjectTemplate: body.subjectTemplate,
            htmlTemplate: body.htmlTemplate,
            textTemplate: body.textTemplate || '',
            variables: body.variables ? JSON.stringify(body.variables) : '[]',
            createdBy: user.id,
            providerOverrides: body.providerOverrides ? JSON.stringify(body.providerOverrides) : '{}',
          }
        }
      }
    });

    return NextResponse.json(newTemplate, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// TypeScript typings
export type { EmailTemplateCreate } from '@/lib/validators/emailTemplate';
