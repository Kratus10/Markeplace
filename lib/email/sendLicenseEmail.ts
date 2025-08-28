import { render } from '@react-email/render';
import { LicenseEmail } from '@/components/email/LicenseEmail';
import { getDownloadUrl } from '@/lib/email/download';

interface SendLicenseEmailParams {
  licenseId: string;
  rawLicense: string;
  productName: string;
  userName: string;
  userEmail: string;
}

export async function sendLicenseEmail({ 
  licenseId, 
  rawLicense, 
  productName, 
  userName,
  userEmail
}: SendLicenseEmailParams) {
  // Generate download URL
  const downloadUrl = await getDownloadUrl(licenseId);
  
  // Render email template
  const emailHtml = render(
    React.createElement(LicenseEmail, {
      licenseKey: rawLicense,
      productName: productName,
      userName: userName,
      downloadUrl: downloadUrl
    })
  );

  try {
    // In production, we would send the email via Resend API
    if (process.env.NODE_ENV === 'production') {
      const resendApiKey = process.env.RESEND_API_KEY;
      if (!resendApiKey) {
        throw new Error('RESEND_API_KEY environment variable is not set');
      }
      
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'noreply@yourmarketplace.com',
          to: [userEmail],
          subject: `Your License for ${productName}`,
          html: emailHtml,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.statusText}`);
      }

      return response.json();
    } else {
      // In development, log the email instead of sending
      console.log('Email content:', emailHtml);
      return { preview: true };
    }
  } catch (error) {
    console.error('Error sending license email:', error);
    throw new Error('Failed to send license email');
  }
}
