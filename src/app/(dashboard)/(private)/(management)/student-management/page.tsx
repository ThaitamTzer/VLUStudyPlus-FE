import type { Metadata } from 'next'

import StudentPage from '@/views/student/studentPage'

export const metadata: Metadata = {
  title: 'Quản lý sinh viên',
  description: 'Quản lý sinh viên',
  keywords: 'Quản lý sinh viên'
}

export default function Page() {
  return <StudentPage />
}
