import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const ProcessResultPage = dynamic(() => import('@/views/process-result/processResultPage'), { ssr: false })

export const metadata: Metadata = {
  title: 'Kết quả xử lý',
  description: 'Kết quả xử lý'
}

export default function Page() {
  return <ProcessResultPage />
}
