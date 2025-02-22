import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const TermPage = dynamic(() => import('@/views/term/termpage'), { ssr: false })

export const metadata: Metadata = {
  title: 'Quản lý học kỳ',
  description: 'Quản lý học kỳ'
}

export default function Page() {
  return <TermPage />
}
