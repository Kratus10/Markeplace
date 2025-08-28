import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function ModerationOverview() {
  // Placeholder data
  const stats = [
    { label: 'Pending Review', value: '24', change: '+3', color: 'bg-yellow-500' },
    { label: 'Auto-Flagged', value: '42', change: '-5', color: 'bg-orange-500' },
    { label: 'Quarantined', value: '8', change: '+2', color: 'bg-red-500' },
    { label: 'Appeals', value: '5', change: '0', color: 'bg-blue-500' },
  ]

  const highPriorityItems = [
    { title: 'Spam comment with malicious links', id: 'COM-128' },
    { title: 'Hate speech in forum post', id: 'TOP-456' },
    { title: 'Malicious file upload', id: 'UPL-789' },
  ]

  const recentActions = [
    { action: 'Comment approved', time: '2 hours ago', moderator: 'admin1@example.com' },
    { action: 'Topic hidden', time: '1 hour ago', moderator: 'admin2@example.com' },
  ]

  return (
    <div>
      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index} className="border rounded-lg shadow-sm">
            <div className="flex flex-row items-center justify-between p-4 border-b">
              <h3 className="text-sm font-medium">{stat.label}</h3>
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.change} from last week
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High priority items */}
        <Card className="border rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">High Priority Items</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {highPriorityItems.map((item, index) => (
                <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">ID: {item.id}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Critical
                    </span>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <Link href="/admin/moderation/item/123">
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent actions */}
        <Card className="border rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Recent Moderator Actions</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {recentActions.map((action, index) => (
                <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <h4 className="font-medium">{action.action}</h4>
                    <span className="text-sm text-muted-foreground">{action.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Moderator: {action.moderator}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
