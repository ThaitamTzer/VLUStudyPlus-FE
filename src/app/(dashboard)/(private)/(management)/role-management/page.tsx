import type { Metadata } from 'next'

import RolePage from '@/views/role/rolepage'

export const metadata: Metadata = {
  title: 'Quản lý vai trò',
  description: 'Quản lý vai trò'
}

export default function Page() {
  return <RolePage />
}
