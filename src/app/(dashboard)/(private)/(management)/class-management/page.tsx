import type { Metadata } from 'next'

import ClassPage from '@/views/class/classPage'

export const metadata: Metadata = {
  title: 'Quản lý lớp niên chế',
  description: 'Quản lý lớp niên chế'
}

export default function ClassManagementPage() {
  return <ClassPage />
}
