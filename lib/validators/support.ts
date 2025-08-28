import { z } from 'zod';

export const ticketCreateSchema = z.object({
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  attachmentIds: z.array(z.string()).optional(),
  captchaToken: z.string().optional(),
  orderId: z.string().optional(),
  guestEmail: z.string().email('Invalid email format').optional(),
  guestName: z.string().optional(),
});

export type TicketCreateSchema = z.infer<typeof ticketCreateSchema>;
