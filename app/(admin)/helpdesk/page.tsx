import Card, { CardContent, CardHeader } from '@/components/ui/Card';
import TicketList from '@/components/support/TicketList';

export default function HelpdeskPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Support Tickets</h1>
          <p className="text-gray-600 mt-2">
            Manage and respond to user support tickets
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Active Tickets</h3>
        </CardHeader>
        <CardContent>
          <TicketList />
        </CardContent>
      </Card>
    </div>
  );
}
