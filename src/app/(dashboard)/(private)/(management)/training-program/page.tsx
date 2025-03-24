import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const TrainingProgramPage = dynamic(() => import('@/views/training-program/trainningProgramPage'), {
  ssr: false
})

export const metadata: Metadata = {
  title: 'Khung chương trình đào tạo',
  description: 'Khung chương trình đào tạo'
}

export default function Page() {
  return <TrainingProgramPage />
}
