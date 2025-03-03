'use client'

import { useEffect } from 'react'

import { useRouter, usePathname } from 'next/navigation'

import type { ACLObj, AppAbility } from '@/configs/acl'

import { AbilityContext } from './AbilityContext'

import { buildAbilityFor } from '@/configs/acl'

import NotAuthorized from '@/views/NotAuthorized'
import { useAuth } from '@/hooks/useAuth'
import { SplashScreen } from '@/components/loading-screen'

interface AclGuardProps {
  children: React.ReactNode
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  const { children, aclAbilities } = props

  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  let ability: AppAbility

  useEffect(() => {
    if (user && user.role.permissionID && pathname === '/') {
      router && router.push('/homepage')
    }
  }, [pathname, user, router])

  if (user && !ability) {
    ability = buildAbilityFor(user.role.permissionID)

    if (pathname === '/') {
      return <SplashScreen />
    }
  }

  if (ability && user && ability.can(aclAbilities.action, aclAbilities.subject)) {
    if (pathname === '/') {
      return <SplashScreen />
    }

    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  if (!user || !ability) {
    router.push('/login')
  }

  return <NotAuthorized mode='dark' />
}

export default AclGuard
