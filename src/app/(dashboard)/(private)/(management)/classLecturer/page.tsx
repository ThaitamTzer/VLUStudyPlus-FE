import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Danh sách lớp',
  description: 'Danh sách lớp'
}

const ClassLecturerPage = dynamic(() => import('@/views/classLecturer/classLecturerPage'))

const Page = () => {
  return <ClassLecturerPage />
}

Page.acl = {
  action: 'read',
  subject: 'class'
}

export default Page
