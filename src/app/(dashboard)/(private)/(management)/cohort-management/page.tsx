import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const CohortPage = dynamic(() => import('@/views/cohort/cohortPage'), { ssr: false })

export const metadata: Metadata = {
  title: 'Quản lý niên khóa',
  description: 'Quản lý niên khóa'
}

export default function Page() {
  return <CohortPage />
}
