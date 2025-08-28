import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { prisma } from "@/lib/prisma";

const DOWNLOAD_URL_TTL = process.env.DOWNLOAD_URL_TTL 
  ? parseInt(process.env.DOWNLOAD_URL_TTL, 10)
  : 300; // 5 minutes default

// Initialize R2 client
const r2 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const generatePresignedDownloadUrl = async (
  licenseId: string,
  productId: string
) => {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  // Validate license exists and is active
  const license = await prisma.license.findUnique({
    where: { id: licenseId, userId: user.id },
    include: { product: true }
  });
  
  if (!license) throw new Error("License not found");
  if (license.revokedAt) throw new Error("License revoked");
  if (license.expiresAt && license.expiresAt < new Date()) throw new Error("License expired");
  
  // Create object key for R2 storage
  const objectKey = `prod/${productId}/${licenseId}/download`;
  
  // Generate presigned URL
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: objectKey,
    ResponseContentDisposition: `attachment; filename="download.zip"`
  });

  const presignedUrl = await getSignedUrl(r2, command, { 
    expiresIn: DOWNLOAD_URL_TTL 
  });

  return presignedUrl;
};
