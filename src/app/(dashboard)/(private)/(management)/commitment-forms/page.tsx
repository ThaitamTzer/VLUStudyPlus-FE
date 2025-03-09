import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const CommitmentFormsPage = dynamic(() => import('@/views/commitmentForms/commitmentFormsPage'), { ssr: false })

export const metadata: Metadata = {
  title: 'Đơn cam kết',
  description: 'Đơn cam kết'
}

export default function Page() {
  return <CommitmentFormsPage />
}
