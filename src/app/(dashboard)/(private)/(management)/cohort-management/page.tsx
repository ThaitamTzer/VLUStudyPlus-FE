import type { Metadata } from 'next'

import CohortPage from '@/views/cohort/cohortPage'

export const metadata: Metadata = {
  title: 'Quản lý niên khóa',
  description: 'Quản lý niên khóa'
}

export default function Page() {
  return <CohortPage />
}
