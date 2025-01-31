'use client'

import { useEffect } from 'react'

import { useRouter, usePathname } from 'next/navigation'

// import AuthRedirect from '@/components/AuthRedirect'
import type { ChildrenType } from '@core/types'
import { useAuth } from '@/hooks/useAuth'
import { SplashScreen } from '@/components/loading-screen'

export default function AuthGuard({ children }: ChildrenType) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathName = usePathname()

  useEffect(() => {
    if (!loading) {
      if (user === null) {
        if (pathName !== '/login') {
          router.replace(`/login?returnTo=${encodeURIComponent(pathName)}`)
        } else {
          router.replace('/login')
        }
      }
    }
  }, [router, pathName, user, loading])

  if (loading || user === null) {
    return <SplashScreen />
  }

  return <>{children}</>
}
