import type { Metadata } from 'next'

import MajorPage from '@/views/major/majorPage'

export const metadata: Metadata = {
  title: 'Quản lý chuyên ngành',
  description: 'Quản lý chuyên ngành'
}

export default function Page() {
  return <MajorPage />
}
