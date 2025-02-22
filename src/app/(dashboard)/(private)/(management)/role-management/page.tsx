import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const RolePage = dynamic(() => import('@/views/role/rolepage'), { ssr: false })

export const metadata: Metadata = {
  title: 'Quản lý vai trò',
  description: 'Quản lý vai trò'
}

export default function Page() {
  return <RolePage />
}
