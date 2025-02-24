import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const ClassStudentPage = dynamic(() => import('@/views/classStudent/classStudentPage'), { ssr: false })

export const metadata: Metadata = {
  title: 'Danh sách sinh viên',
  description: 'Danh sách sinh viên'
}

export default function ClassStudentManagementPage() {
  return <ClassStudentPage />
}
