import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thống kê',
  description: 'Thống kê'
}

const StatisticsPage = dynamic(() => import('@/views/statistics/statisticsPage'), {
  ssr: false
})

export default function Page() {
  return <StatisticsPage />
}
