import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Xử lý học vụ sinh viên | VLUStudyPlus - Đại học Văn Lang',
  description:
    'Hệ thống xử lý học vụ trực tuyến cho sinh viên Đại học Văn Lang. Quản lý đăng ký môn học, xem điểm thi, lịch học và các thông tin học vụ quan trọng.',
  keywords: 'xử lý học vụ, đại học văn lang, đăng ký môn học, điểm thi, lịch học, sinh viên văn lang'
}

const LearningProcessingPage = dynamic(() => import('@/views/learnProcess/learnProcessPage'), {
  ssr: false
})

export default function LearningProcessing() {
  return <LearningProcessingPage />
}
