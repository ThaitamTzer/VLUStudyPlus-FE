import type { Metadata } from 'next'

import LecturerPage from '@/views/lecturer/lecturerPage'

export const metadata: Metadata = {
  title: 'Quản lý cán bộ, giảng viên',
  description: 'Quản lý cán bộ, giảng viên',
  keywords: 'Quản lý cán bộ, giảng viên'
}

export default function Page() {
  return <LecturerPage />
}
