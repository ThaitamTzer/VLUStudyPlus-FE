'use client'

// Next Imports
import { useEffect, useState } from 'react'

import { redirect } from 'next/navigation'

// Type Imports
import type { ChildrenType } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'
import { SplashScreen } from '@/components/loading-screen'

// Util Imports

const GuestOnlyRoute = ({ children }: ChildrenType) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken')

    if (storedToken) {
      redirect(themeConfig.homePageUrl)
    } else {
      setLoading(false)
    }
  }, [])

  return <>{loading ? <SplashScreen /> : children}</>
}

// const GuestOnlyRoute = async ({ children }: ChildrenType) => {
//   const session = await getServerSession()

//   if (session) {
//     redirect(themeConfig.homePageUrl)
//   }

//   return <>{children}</>
// }

export default GuestOnlyRoute
