import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thống kê',
  description: 'Thống kê'
}

const StatisticsXLHTprocessOfCVHTPage = dynamic(() => import('@/views/statistics/statisticsXLHTprocessOfCVHTPage'), {
  ssr: false
})

export default function Page() {
  return <StatisticsXLHTprocessOfCVHTPage />
}
