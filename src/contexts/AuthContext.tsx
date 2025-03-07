'use client'

// ** React Imports
import type { ReactNode } from 'react'
import { createContext, useEffect, useState } from 'react'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

import useSWR from 'swr'

import Cookies from 'js-cookie'

// ** Next Import

// ** Axios
import axiosClient from '@/libs/axios'

// ** Config
import authConfig from '@/configs/auth'

// ** Types
import type { AuthValuesType } from './AuthValuesType'
import type { UserType } from '@/types/userType'
import lecturerService from '@/services/lecturer.service'
import type { Lecturer } from '@/types/management/lecturerType'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  logout: () => Promise.resolve(),
  getProfile: () => Promise.resolve(),
  lecturerData: null,
  setLecturerData: () => null
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)
  const [lecturerData, setLecturerData] = useState<Lecturer[] | null>(defaultProvider.lecturerData)

  const setAllNull = () => {
    setUser(null)
  }

  // ** Hooks
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()

  const accessToken = searchParams.get('accessToken')

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken)
      router.replace('/')
    }
  }, [accessToken, router])

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      if (!localStorage.getItem('accessToken')) {
        localStorage.clear()
        setUser(null)
        router.replace('/login?returnTo=' + pathName)
        setLoading(false)
      }

      await axiosClient
        .get('/api/auth/get-user-profile')
        .then(async response => {
          setUser({ ...response.data })
          setLoading(false)
          Cookies.set('userData', response.data)
        })
        .catch(() => {
          setUser(null)
          localStorage.clear()
          setLoading(false)
          Cookies.remove('userData')

          if (authConfig.onTokenExpiration === 'logout' && !pathName.includes('login')) {
            router.replace('/login')
          }
        })
    }

    initAuth()
  }, [pathName, router])

  const getProfile = async () => {
    await axiosClient
      .get('/api/auth/get-user-profile')
      .then(async response => {
        setUser({ ...response.data })
      })
      .catch(() => {
        setUser(null)
        localStorage.clear()
      })
  }

  const handleLogout = () => {
    try {
      axiosClient.patch(authConfig.logoutEndpoint).then(() => {
        Cookies.remove('userData')
        localStorage.clear()
        setAllNull()
        router.push('/')
      })
    } catch {
      Cookies.remove('userData')
      localStorage.clear()
      setUser(null)
      router.push('/')
    }
  }

  // có user thì mới thực hiện useSWR
  useSWR(user ? 'optionsUpdateLecturers' : null, () => lecturerService.getAll(1, 999), {
    onSuccess: data => {
      setLecturerData(data.lecturers)
    },
    revalidateOnFocus: false,
    keepPreviousData: true
  })

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    logout: handleLogout,
    getProfile: getProfile,
    lecturerData,
    setLecturerData
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
