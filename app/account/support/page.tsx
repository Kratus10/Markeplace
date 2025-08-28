import TicketList from '@/components/support/TicketList';
import { getServerSession } from '@/lib/auth/sessionUtils';
import { redirect } from 'next/navigation';

export default async function SupportTicketsPage() {
  const session = await getServerSession();
  
  if (!session || !session.user) {
    redirect('/auth/login?returnUrl=/account/support');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Support Tickets</h1>
      <p className="text-lg mb-8">
        Here you can view all your support requests and their current status.
      </p>
      
      <TicketList />
    </div>
  );
}
