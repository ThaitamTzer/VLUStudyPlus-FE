import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const LecturerPage = dynamic(() => import('@/views/lecturer/lecturerPage'), { ssr: false })

export const metadata: Metadata = {
  title: 'Quản lý cán bộ, giảng viên, nhân viên',
  description: 'Quản lý cán bộ, giảng viên, nhân viên',
  keywords: 'Quản lý cán bộ, giảng viên, nhân viên'
}

export default function Page() {
  return <LecturerPage />
}
