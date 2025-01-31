'use client'

import { useEffect } from 'react'

import { useRouter, usePathname } from 'next/navigation'

// import AuthRedirect from '@/components/AuthRedirect'
import type { ChildrenType } from '@core/types'
import { useAuth } from '@/hooks/useAuth'

export default function AuthGuard({ children }: ChildrenType) {
  const { user } = useAuth()
  const router = useRouter()
  const pathName = usePathname()

  useEffect(() => {
    if (!router) {
      return
    }

    if (user === null && !window.localStorage.getItem('accessToken')) {
      if (pathName !== '/login') {
        router.replace(`/login?returnTo=${encodeURIComponent(pathName)}`)
      } else {
        router.replace('/login')
      }
    }
  }, [router, pathName, user])

  return <>{children}</>
}
