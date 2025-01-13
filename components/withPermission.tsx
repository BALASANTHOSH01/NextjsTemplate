import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { hasPermission } from '@/lib/rbac'

export function withPermission(WrappedComponent: React.ComponentType, requiredPermission: string) {
  return function PermissionWrapper(props: any) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [hasAccess, setHasAccess] = useState(false)

    useEffect(() => {
      async function checkPermission() {
        if (session?.user?.id) {
          const permitted = await hasPermission(session.user.id, requiredPermission)
          setHasAccess(permitted)
          if (!permitted) {
            router.push('/unauthorized')
          }
        }
      }

      if (status === 'authenticated') {
        checkPermission()
      }
    }, [session, status, router])

    if (status === 'loading' || !hasAccess) {
      return <div>Loading...</div>
    }

    return <WrappedComponent {...props} />
  }
}

