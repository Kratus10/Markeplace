import { getCurrentUser } from '@/lib/auth/getCurrentUser'

export default async function ModerationItemPage({ 
  params 
}: { 
  params: { itemId: string } 
}) {
  const user = await getCurrentUser()
  if (!user || !['OWNER', 'ADMIN_L1', 'ADMIN_L2'].includes(user.role)) {
    return <div>Unauthorized</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Moderation Item #{params.itemId}</h1>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Comment Content</h2>
          <div className="bg-gray-50 p-4 rounded border border-gray-200">
            <p className="text-gray-800">This is a sample comment that might contain inappropriate content that needs moderation.</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Analysis</h2>
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Confidence:</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">92%</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium mr-2">Categories:</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded">Hate Speech</span>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
              Approve
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
              Remove
            </button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">
              Quarantine
            </button>
            <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition">
              Escalate
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Reason for Action</h2>
          <textarea
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Provide reason for moderation action..."
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Submit Action
          </button>
        </div>
      </div>
    </div>
  )
}
