'use client'
import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface PageOverride {
  id: string
  pagePath: string
  title: string
  description: string | null
  keywords: string | null
}

export default function PageOverrideEditor() {
  const [overrides, setOverrides] = useState<PageOverride[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOverrides = async () => {
      try {
        const response = await fetch('/api/admin/seo/page-overrides')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        setOverrides(data)
      } catch (err) {
        setError('Failed to load page overrides')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOverrides()
  }, [])

  if (loading) {
    return <div className="p-6">Loading page overrides...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Page SEO Overrides</h1>
        <Link href="/admin/seo/page-overrides/new">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Override
          </Button>
        </Link>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Current Overrides</h2>
        {overrides.length === 0 ? (
          <p className="text-muted-foreground">No overrides created yet</p>
        ) : (
          <div className="space-y-4">
            {overrides.map((override) => (
              <div key={override.id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="font-medium">{override.pagePath}</p>
                  <p className="text-sm text-muted-foreground">
                    {override.title || 'No title specified'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link href={`/admin/seo/page-overrides/${override.id}`}>
                    <Button size="sm" variant="outline" className="flex items-center">
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </Link>
                  <Button size="sm" variant="danger" className="flex items-center">
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
