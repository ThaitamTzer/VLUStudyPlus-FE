import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const StatisticsPage = dynamic(() => import('@/views/statistics/statisticsPage'), {
  ssr: false
})

export const metadata: Metadata = {
  title: 'Thống kê chung'
}

export default function Page() {
  return <StatisticsPage />
}
