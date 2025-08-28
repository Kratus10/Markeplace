"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ticketCreateSchema } from '@/lib/validators/support';
import { zodResolver } from '@hookform/resolvers/zod';
import type { TicketCreateSchema } from '@/lib/validators/support';
import dynamic from 'next/dynamic';

// Dynamically import components to avoid server-side rendering issues
const Button = dynamic(() => import('@/components/ui/Button').then(mod => mod.default), { ssr: false });
const Input = dynamic(() => import('@/components/ui/Input').then(mod => mod.default), { ssr: false });
const Textarea = dynamic(() => import('@/components/ui/Textarea').then(mod => mod.default), { ssr: false });
const Label = dynamic(() => import('@/components/ui/Label').then(mod => mod.default), { ssr: false });
const Uploader = dynamic(() => import('@/components/ui/Uploader').then(mod => mod.default), { ssr: false });

export function TicketForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<TicketCreateSchema>({
    resolver: zodResolver(ticketCreateSchema),
    defaultValues: {
      subject: '',
      message: '',
      captchaToken: '',
      orderId: '',
      guestEmail: '',
      guestName: '',
    }
  });

  const handleUploadSuccess = (file: File, key: string) => {
    setAttachments(prev => [...prev, key]);
  };

  const onSubmit = async (data: TicketCreateSchema) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const payload = {
        ...data,
        attachmentIds: attachments,
      };
      
      const response = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(await response.text() || 'Failed to submit ticket');
      }
      
      setSuccess(true);
    } catch (err) {
      console.error('Submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit ticket');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-2 text-lg font-medium">Ticket Submitted</h3>
        <p className="mt-1 text-gray-500">
          Your support ticket has been created successfully. We'll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          placeholder="What's this about?"
          {...form.register('subject')}
          disabled={isLoading}
        />
        {form.formState.errors.subject && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.subject.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          placeholder="Please describe your issue"
          {...form.register('message')}
          disabled={isLoading}
          rows={5}
        />
        {form.formState.errors.message && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.message.message}
          </p>
        )}
      </div>

      <div>
        <Label>Attachments</Label>
        <Uploader onUploadSuccess={handleUploadSuccess} />
        <p className="text-sm text-gray-500 mt-2">
          Maximum file size: 10MB. Supported formats: PDF, JPG, PNG, DOC, DOCX
        </p>
        {attachments.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium">Files to attach:</p>
            <ul className="text-sm text-gray-500">
              {attachments.map((att, index) => (
                <li key={index}>Attachment {index + 1}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="orderId">Order ID (Optional)</Label>
        <Input
          id="orderId"
          placeholder="If related to an order"
          {...form.register('orderId')}
          disabled={isLoading}
        />
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-sm font-medium mb-2">Guest Information (if not logged in)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="guestEmail">Email *</Label>
            <Input
              id="guestEmail"
              type="email"
              placeholder="your@email.com"
              {...form.register('guestEmail')}
              disabled={isLoading}
            />
            {form.formState.errors.guestEmail && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.guestEmail.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="guestName">Name</Label>
            <Input
              id="guestName"
              placeholder="Your name"
              {...form.register('guestName')}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full justify-center"
        >
          {isLoading ? 'Submitting...' : 'Submit Ticket'}
        </Button>
        
        {error && (
          <p className="mt-2 text-red-500 text-sm text-center">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
