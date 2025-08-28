export async function getDownloadUrl(licenseId: string): Promise<string> {
  // In a real implementation, this would call our download endpoint
  // For email purposes, we return a link to the license detail page
  return `${process.env.NEXTAUTH_URL}/account/licenses/${licenseId}`;
}
