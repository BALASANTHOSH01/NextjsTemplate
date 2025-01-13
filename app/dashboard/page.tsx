'use client'

import { useSession } from 'next-auth/react'
import { FileUpload } from '@/components/ui/file-upload'

export default function Dashboard() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return <div>Unauthorized</div>
  }

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Welcome back, {session.user.name}!</h2>
        <p className="text-gray-600">This is your dashboard where you can manage your account and files.</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Upload Files</h3>
        <FileUpload />
      </div>
    </div>
  )
}