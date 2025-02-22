import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const StudentPage = dynamic(() => import('@/views/student/studentPage'), { ssr: false })

export const metadata: Metadata = {
  title: 'Quản lý sinh viên',
  description: 'Quản lý sinh viên',
  keywords: 'Quản lý sinh viên'
}

export default function Page() {
  return <StudentPage />
}
