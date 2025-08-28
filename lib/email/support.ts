import { sendEmail } from '@/lib/email/sendEmail';
import type { SupportTicket } from '@prisma/client';

// Send confirmation email to ticket submitter
export async function sendTicketConfirmation(ticket: SupportTicket) {
  const subject = 'Your Support Ticket Has Been Created';
  const body = `
    <p>Thank you for contacting us! Your support ticket has been created successfully.</p>
    <p><strong>Ticket ID:</strong> ${ticket.id}</p>
    <p><strong>Subject:</strong> ${ticket.subject}</p>
    <p>We'll get back to you as soon as possible. You can view your ticket status at [Link to Ticket].</p>
    <p>Best regards,<br/>Support Team</p>
  `;

  await sendEmail({
    to: ticket.submitterEmail,
    subject,
    html: body,
  });
}

// Notify admin about new ticket
export async function notifyAdminNewTicket(ticket: SupportTicket) {
  const subject = `New Support Ticket: ${ticket.subject}`;
  const body = `
    <p>A new support ticket has been created:</p>
    <p><strong>ID:</strong> ${ticket.id}</p>
    <p><strong>From:</strong> ${ticket.submitterName} <${ticket.submitterEmail}></p>
    <p><strong>Subject:</strong> ${ticket.subject}</p>
    <p><strong>Priority:</strong> ${ticket.priority}</p>
    <p>Please review the ticket in the admin dashboard: [Admin Link]</p>
  `;

  await sendEmail({
    to: process.env.SUPPORT_EMAIL || 'admin@example.com',
    subject,
    html: body,
  });
}
