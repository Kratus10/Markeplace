import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Fixed import
import crypto from 'crypto';
import { z } from 'zod';

// Schema for VirusTotal webhook payload
const VirusTotalWebhookSchema = z.object({
  data: z.object({
    type: z.literal('analysis'),
    id: z.string(), // SHA256 hash of the file
    attributes: z.object({
      status: z.enum(['completed', 'queued', 'in-progress']),
      stats: z.object({
        malicious: z.number(),
        suspicious: z.number(),
        undetected: z.number(),
        harmless: z.number(),
        timeout: z.number()
      }).optional(),
      results: z.record(z.string(), z.object({
        category: z.string(),
        result: z.string(),
        method: z.string(),
        engine_name: z.string()
      })).optional()
    })
  })
});

export async function POST(request: Request) {
  try {
    // Verify webhook signature
    const signature = request.headers.get('X-VT-Signature');
    const publicKey = process.env.VIRUSTOTAL_PUBLIC_KEY;
    
    if (!signature || !publicKey) {
      return NextResponse.json(
        { error: 'Missing security headers' },
        { status: 401 }
      );
    }

    const body = await request.text();
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(body);
    
    if (!verifier.verify(publicKey, signature, 'base64')) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse and validate payload
    const json = JSON.parse(body);
    const parsed = VirusTotalWebhookSchema.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid payload', details: parsed.error },
        { status: 400 }
      );
    }

    const { data: { id: fileHash, attributes } } = parsed.data;

    // Find the upload record using sha256 field
    const upload = await prisma.upload.findFirst({
      where: { sha256: fileHash },
      select: { id: true, status: true }
    });

    if (!upload) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Handle different scan statuses
    let newStatus = upload.status;
    let scanReport = null;

    if (attributes.status === 'completed') {
      // Determine file safety based on scan results
      const { stats } = attributes;
      const isMalicious = (stats?.malicious || 0) > 0;
      const isSuspicious = (stats?.suspicious || 0) > 0;

      newStatus = isMalicious ? 'QUARANTINED' : 
                 isSuspicious ? 'SUSPICIOUS' : 'SCANNED';
      
      // Store detailed scan report
      scanReport = JSON.stringify(attributes.results);
    }

    // Update upload record
    await prisma.upload.update({
      where: { id: upload.id },
      data: {
        status: newStatus,
        ...(scanReport && { scanReportKey: `scan-reports/${fileHash}.json` })
      }
    });

    // Optionally: Store full report in R2 if needed
    // Implementation would go here using R2 client

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('VirusTotal webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
