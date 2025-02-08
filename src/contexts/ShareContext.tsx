// 'use client'

// // ** React Imports
// import type { ReactNode } from 'react'
// import { createContext, useEffect, useState } from 'react'

// import { useRouter, usePathname, useSearchParams } from 'next/navigation'

// import Cookies from 'js-cookie'

// import axiosClient from '@/libs/axios'

// import type { Cohort } from '@/types/management/cohortType'

// type ShareContextTypes = {
//   cohorts: Cohort[]
//   getCohorts: () => void
// }

// const defaultProvider: ShareContextTypes = {
//   cohorts: [],
//   getCohorts: () => {}
// }

// const ShareContext = createContext<ShareContextTypes>(defaultProvider)

// type Props = {
//   children: ReactNode
// }

// const ShareProvider = ({ children }: Props) => {
//   const [cohorts, setCohorts] = useState<Cohort[]>(defaultProvider.cohorts)



//   useEffect(() => {
//     getCohorts()
//   }, [])

//   return <ShareContext.Provider value={{ cohorts, getCohorts }}>{children}</ShareContext.Provider>
// }



