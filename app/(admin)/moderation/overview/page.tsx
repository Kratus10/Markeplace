import { getCurrentUser } from '@/lib/auth/getCurrentUser'
import { redirect } from 'next/navigation'
import ModerationOverview from '@/components/moderation/ModerationOverview'

export default async function ModerationOverviewPage() {
  const user = await getCurrentUser()
  if (!user || !['OWNER', 'ADMIN_L1', 'ADMIN_L2'].includes(user.role)) {
    redirect('/auth/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Content Moderation Dashboard</h1>
        <ModerationOverview />
      </div>
    </div>
  )
}
