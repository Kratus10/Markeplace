import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { prisma } from '@/lib/prisma';
import ModerationQueue from '@/components/moderation/QueueTable'

export default async function ModerationQueuePage() {
  const user = await getCurrentUser()
  if (!user || !['OWNER', 'ADMIN_L1', 'ADMIN_L2'].includes(user.role)) {
    return <div>Unauthorized</div>
  }

  // Fetch items needing moderation (simplified example)
  const queueItems = await prisma.moderationQueueItem.findMany({
    where: { status: 'PENDING' },
    include: {
      product: true
    },
    take: 20
  })

  const transformedItems = queueItems.map(item => ({
    id: item.id,
    title: item.product?.name || 'N/A',
    source: 'Product',
    status: item.status,
    priority: 'medium' as const,
    created: new Date(item.createdAt).toLocaleDateString(),
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Moderation Queue</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Apply Filters
          </button>
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Bulk Actions
          </button>
        </div>
      </div>
      
      <ModerationQueue items={transformedItems} />
    </div>
  )
}
