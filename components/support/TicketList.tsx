import Card, { CardContent, CardHeader } from '@/components/ui/Card';

// Placeholder component until we implement the full ticket list
export default function TicketList() {
  return (
    <div>
      <p className="text-center py-8">Ticket list component will be implemented soon</p>
      <div className="space-y-4">
        {[1, 2, 3].map((id) => (
          <Card key={id}>
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold">Support Ticket #{id}</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">This is a placeholder for ticket #{id}</p>
              <div className="mt-2 text-sm text-gray-500">
                <p>Status: Open</p>
                <p>Priority: Medium</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
