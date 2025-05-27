import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const StudentGradePage = dynamic(() => import('@/views/student-grade/StudentGradePage'), {
  ssr: false
})

export const metadata: Metadata = {
  title: 'Kết quả học tập'
}

export default function Page() {
  return <StudentGradePage />
}
