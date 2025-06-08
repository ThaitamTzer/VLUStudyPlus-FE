import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thống kê',
  description: 'Thống kê'
}

const StatisticsXLHTClassPage = dynamic(() => import('@/views/statistics/statisticsXLHTClassPage'), {
  ssr: false
})

export default function Page() {
  return <StatisticsXLHTClassPage />
}
