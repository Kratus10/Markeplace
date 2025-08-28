import { NextRequest } from 'next/server';
import { IncomingMessage } from 'http';

export function toIncomingMessage(req: NextRequest): IncomingMessage {
  const headers: Record<string, string | string[]> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    headers,
    method: req.method,
    url: req.url,
  } as unknown as IncomingMessage;
}
