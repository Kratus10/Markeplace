export interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(params: EmailParams) {
  const { to, subject, html, text } = params;
  
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
          from: process.env.SUPPORT_EMAIL || 'noreply@yourmarketplace.com',
          to: [to],
          subject,
          html,
          text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send email: ${response.statusText}`);
      }

      return response.json();
    } else {
      // In development, log the email instead of sending
      console.log('Email content:', { to, subject, html, text });
      return { preview: true };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}
