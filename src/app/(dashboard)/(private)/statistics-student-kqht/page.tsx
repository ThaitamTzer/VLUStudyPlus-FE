import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thống kê',
  description: 'Thống kê'
}

const StatisticsStudentKQHTPage = dynamic(() => import('@/views/statistics/statisticsStudentKQHTPage'), {
  ssr: false
})

export default function Page() {
  return <StatisticsStudentKQHTPage />
}
