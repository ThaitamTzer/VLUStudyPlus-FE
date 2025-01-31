'use client'

// Next Imports
import { useEffect, useState } from 'react'

import { redirect } from 'next/navigation'

// Third-party Imports
import { getServerSession } from 'next-auth'

// Type Imports
import type { ChildrenType } from '@core/types'

// Config Imports
import themeConfig from '@configs/themeConfig'

// Util Imports

const GuestOnlyRoute = ({ children }: ChildrenType) => {
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken')

    setToken(storedToken)
  }, [])

  if (token) {
    console.log('accessToken guest', token)
    redirect(themeConfig.homePageUrl)
  }

  return <>{children}</>
}

// const GuestOnlyRoute = async ({ children }: ChildrenType) => {
//   const session = await getServerSession()

//   if (session) {
//     redirect(themeConfig.homePageUrl)
//   }

//   return <>{children}</>
// }

export default GuestOnlyRoute
