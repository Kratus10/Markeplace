'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReCAPTCHA from 'react-google-recaptcha';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  projectType: z.enum(['indicator', 'ea', 'script', 'other']),
  description: z.string().min(20, 'Please provide a detailed description (at least 20 characters)'),
  budget: z.number().min(50, 'Minimum budget is $50'),
  timeframe: z.string().min(1, 'Please specify a timeframe'),
});

type FormData = z.infer<typeof formSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    if (!recaptchaToken) {
      setSubmitError('Please complete the reCAPTCHA verification');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // In a real implementation, this would send data to your backend
      console.log('Form data with reCAPTCHA token:', { ...data, recaptchaToken });
      
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError('Failed to submit request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <h3 className="text-xl font-bold text-green-700 mb-2">Request Submitted!</h3>
        <p className="text-green-600">
          Thank you for your request. Our team will review it and contact you within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">{submitError}</p>
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Your Name
        </label>
        <input
          id="name"
          type="text"
          className={`w-full px-4 py-2 border rounded-lg ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
          {...register('name')}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          className={`w-full px-4 py-2 border rounded-lg ${errors.email ? 'border-red-300' : 'border-gray-300'}`}
          {...register('email')}
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Project Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          {['indicator', 'ea', 'script', 'other'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="radio"
                value={type}
                className="mr-2"
                {...register('projectType')}
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
        </div>
        {errors.projectType && <p className="mt-1 text-sm text-red-600">{errors.projectType.message}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Project Description
        </label>
        <textarea
          id="description"
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
          {...register('description')}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Budget ($)
          </label>
          <input
            id="budget"
            type="number"
            className={`w-full px-4 py-2 border rounded-lg ${errors.budget ? 'border-red-300' : 'border-gray-300'}`}
            {...register('budget', { valueAsNumber: true })}
          />
          {errors.budget && <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>}
        </div>

        <div>
          <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
            Timeframe
          </label>
          <input
            id="timeframe"
            type="text"
            placeholder="e.g., 2 weeks, 1 month"
            className={`w-full px-4 py-2 border rounded-lg ${errors.timeframe ? 'border-red-300' : 'border-gray-300'}`}
            {...register('timeframe')}
          />
          {errors.timeframe && <p className="mt-1 text-sm text-red-600">{errors.timeframe.message}</p>}
        </div>
      </div>

      <div className="my-6">
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "your-recaptcha-site-key"}
          onChange={setRecaptchaToken}
        />
        {!recaptchaToken && submitError && (
          <p className="mt-1 text-sm text-red-600">Please complete the reCAPTCHA verification</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-70"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
};

export default ContactForm;
