import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const FormTemplatePage = dynamic(() => import('@/views/form-template/FormTemplatePage'), { ssr: false })

export const metadata: Metadata = {
  title: 'Mẫu đơn cam kết',
  description: 'Mẫu đơn cam kết'
}

export default function Page() {
  return <FormTemplatePage />
}
