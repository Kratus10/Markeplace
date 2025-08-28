'use client';

import React, { useState } from 'react';
import HeroSection from '@/components/ui/HeroSection';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { EnvelopeIcon, UserIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const HirePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    budget: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError('');

    try {
      // In a real application, you would verify the reCAPTCHA token here
      // For demonstration, we'll simulate an API call
      const response = await fetch('/api/hire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit your request');
      }

      setSubmissionSuccess(true);
      setFormData({ name: '', email: '', description: '', budget: '' });
    } catch (err) {
      setSubmissionError((err as Error).message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <HeroSection
        title="Hire a Developer for Your Project"
        subtitle="Let's bring your trading tool ideas to life"
        className="bg-gradient-to-r from-blue-600 to-lime-600 text-white"
      />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Why hire through our platform?</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-blue-800 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Vetted developers with proven trading expertise</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-800 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Secure and confidential project handling</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-800 rounded-full p-2 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span>Escrow payment protection for both parties</span>
                </li>
              </ul>
              <div className="mt-8 bg-blue-800/30 rounded-lg p-4">
                <h3 className="font-bold mb-2">How it works</h3>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Submit your project details</li>
                  <li>We match you with qualified developers</li>
                  <li>Review proposals and select a developer</li>
                  <li>Secure payment upon project completion</li>
                </ol>
              </div>
            </div>
            
            <div className="md:w-1/2 p-8">
              {submissionSuccess ? (
                <div className="text-center py-12">
                  <div className="bg-green-100 rounded-full p-4 inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mt-6 mb-2">Request Submitted!</h3>
                  <p className="text-gray-600 mb-6">
                    We've received your project request. Our team will review it and contact you within 24-48 hours.
                  </p>
                  <Button 
                    variant="primary" 
                    onClick={() => setSubmissionSuccess(false)}
                  >
                    Submit Another Request
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Tell us about your project</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                      <Input
                        label="Your Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        icon={<UserIcon className="h-5 w-5 text-gray-400" />}
                      />
                      
                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        icon={<EnvelopeIcon className="h-5 w-5 text-gray-400" />}
                      />
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Project Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                          placeholder="Describe your project requirements, timeline, and any specific technologies needed..."
                        ></textarea>
                      </div>
                      
                      <Input
                        label="Estimated Budget (USD)"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        icon={<CurrencyDollarIcon className="h-5 w-5 text-gray-400" />}
                        hint="Approximate budget helps us match you with appropriate developers"
                      />
                      
                      <div className="pt-2">
                        <div id="recaptcha-container" className="bg-gray-100 rounded p-4 text-center">
                          {/* reCAPTCHA would be loaded here */}
                          <div className="text-sm text-gray-500">
                            [reCAPTCHA will appear here in production]
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-4">
                        <p className="text-sm text-gray-600">
                          We respect your privacy. Your information will only be used to contact you about your project.
                        </p>
                        <Button
                          type="submit"
                          variant="primary"
                          size="lg"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </Button>
                      </div>
                      
                      {submissionError && (
                        <div className="text-red-600 bg-red-50 py-2 px-4 rounded">
                          {submissionError}
                        </div>
                      )}
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HirePage;
