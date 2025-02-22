import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const MajorPage = dynamic(() => import('@/views/major/majorPage'), { ssr: false })

export const metadata: Metadata = {
  title: 'Quản lý chuyên ngành',
  description: 'Quản lý chuyên ngành'
}

export default function Page() {
  return <MajorPage />
}
