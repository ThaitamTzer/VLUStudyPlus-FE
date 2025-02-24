import type { Metadata } from 'next'

import TypeProcessPage from '@/views/type-process/typeProcessPage'

export const metadata: Metadata = {
  title: 'Quản lý loại xử lý',
  description: 'Quản lý loại xử lý'
}

export default function TypeProcess() {
  return <TypeProcessPage />
}
