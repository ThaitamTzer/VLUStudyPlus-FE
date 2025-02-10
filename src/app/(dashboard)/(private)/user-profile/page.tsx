import type { Metadata } from 'next'

import ProfilePage from '@/views/user-profile/profilePage'

export const metadata: Metadata = {
  title: 'Trang cá nhân',
  description: 'Trang cá nhân'
}

export default function Page() {
  return <ProfilePage />
}
