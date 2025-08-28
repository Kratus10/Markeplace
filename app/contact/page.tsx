import { TicketForm } from '@/components/support/TicketForm';
import Link from 'next/link';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-lg mb-6">
        You can reach us at <a href="mailto:support@example.com" className="text-blue-500">support@example.com</a>.
        Alternatively, submit a ticket using the form below and we'll get back to you as soon as possible.
      </p>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Submit a Support Ticket</h2>
        <TicketForm />
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Looking for existing tickets?{' '}
          <Link href="/account/support" className="text-blue-500 hover:underline">
            View your support tickets
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
