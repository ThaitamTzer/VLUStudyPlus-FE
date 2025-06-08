import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thống kê',
  description: 'Thống kê'
}

const StatisticsXLHTstudentPage = dynamic(() => import('@/views/statistics/statisticsXLHTstudentpage'), {
  ssr: false
})

export default function Page() {
  return <StatisticsXLHTstudentPage />
}
