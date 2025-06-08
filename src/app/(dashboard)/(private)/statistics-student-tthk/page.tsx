'use client'

import dynamic from 'next/dynamic'

const StatisticsProgressOfStudentPage = dynamic(() => import('@/views/statistics/statisticsProgressOfStudentPage'), {
  ssr: false
})

export default function StatisticsStudentTTHKPage() {
  return <StatisticsProgressOfStudentPage />
}
