import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const StudentAcedemicProcessPage = dynamic(() => import('@/views/studentAcedemicProcess/studentAcedemicProcessPage'), {
  ssr: false
})

export const metadata: Metadata = {
  title: 'Tình trạng học vụ',
  description: 'Xem tình trạng học vụ của sinh viên'
}

export default function Page() {
  return <StudentAcedemicProcessPage />
}
