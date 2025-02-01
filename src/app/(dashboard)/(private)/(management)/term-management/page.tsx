import type { Metadata } from 'next'

import TermPage from '@/views/term/termpage'

export const metadata: Metadata = {
  title: 'Quản lý học kỳ',
  description: 'Quản lý học kỳ'
}

export default function Page() {
  return <TermPage />
}
