import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const ClassPage = dynamic(() => import('@/views/class/classPage'), { ssr: false })

export const metadata: Metadata = {
  title: 'Quản lý lớp niên chế',
  description: 'Quản lý lớp niên chế'
}

export default function ClassManagementPage() {
  return <ClassPage />
}
