// Helper function to sanitize HTML using DOMPurify
export async function sanitizeHtml(html: string): Promise<string> {
  if (process.env.NODE_ENV === 'development') {
    // In development, skip sanitization for simplicity
    return Promise.resolve(html);
  }
  
  try {
    // Lazy-load dependencies only in production
    const { JSDOM } = await import('jsdom');
    const dompurify = await import('dompurify');
    const window = new JSDOM('').window;
    const DOMPurify = dompurify.default(window as any);
    return DOMPurify.sanitize(html) as string;
  } catch (error) {
    console.error('HTML sanitization failed', error);
    return html;
  }
}
