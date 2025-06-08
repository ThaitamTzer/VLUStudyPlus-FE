import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thống kê',
  description: 'Thống kê'
}

const StatisticsXLHTStatusPage = dynamic(() => import('@/views/statistics/statisticsXLHTStatuspage'), {
  ssr: false
})

export default function Page() {
  return <StatisticsXLHTStatusPage />
}
