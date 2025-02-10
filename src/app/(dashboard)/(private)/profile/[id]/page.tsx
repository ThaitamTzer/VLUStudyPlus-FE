import dynamic from 'next/dynamic'

const ProfileStudent = dynamic(() => import('@/views/profile/profile'), { ssr: false })

export const metadata = {
  title: 'Hồ sơ',
  description: 'Profile page'
}

export default function Page({ params }: { params: { id: string } }) {
  return <ProfileStudent params={params} />
}
