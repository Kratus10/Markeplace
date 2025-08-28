export enum reCAPTCHAAction {
  SUPPORT_TICKET = 'SUPPORT_TICKET',
}

export async function verifyReCAPTCHA(token: string, action: reCAPTCHAAction): Promise<boolean> {
  // In development mode, skip validation
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  // Skip if RECAPTCHA_SECRET_KEY is not set
  if (!process.env.RECAPTCHA_SECRET_KEY) {
    console.warn('RECAPTCHA_SECRET_KEY not set - skipping verification');
    return true;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const data = await response.json();
    
    return data.success === true && data.score >= 0.5 && data.action === action;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}
