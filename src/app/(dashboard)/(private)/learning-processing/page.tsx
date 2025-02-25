import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quản lý xử lý học tập sinh viên',
  description: 'Quản lý xử lý học tập sinh viên'
}

const LearningProcessingPage = dynamic(() => import('@/views/learnProcess/learnProcessPage'), {
  ssr: false
})

export default function LearningProcessing() {
  return <LearningProcessingPage />
}
