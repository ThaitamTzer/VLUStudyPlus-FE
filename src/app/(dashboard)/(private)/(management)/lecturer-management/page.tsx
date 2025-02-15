import type { Metadata } from 'next'

import LecturerPage from '@/views/lecturer/lecturerPage'

export const metadata: Metadata = {
  title: 'Quản lý cán bộ, giảng viên, nhân viên',
  description: 'Quản lý cán bộ, giảng viên, nhân viên',
  keywords: 'Quản lý cán bộ, giảng viên, nhân viên'
}

export default function Page() {
  return <LecturerPage />
}
