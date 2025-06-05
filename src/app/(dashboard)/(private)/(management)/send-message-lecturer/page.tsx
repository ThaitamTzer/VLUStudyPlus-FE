import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const SendMessageByLecturerPage = dynamic(() => import('@/views/sendMessageLecturer/sendMessageLecturerPage'), {
  ssr: false
})

export const metadata: Metadata = {
  title: 'Thông báo',
  description: 'Thông báo cho sinh viên'
}

export default function SendMessageLecturerPage() {
  return <SendMessageByLecturerPage />
}
