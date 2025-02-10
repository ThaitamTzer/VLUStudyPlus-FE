import dynamic from 'next/dynamic'

const ProfileLecturer = dynamic(() => import('@/views/profileLecturer/profile'), { ssr: false })

export const metadata = {
  title: 'Hồ sơ',
  description: 'Profile page'
}

export default function Page({ params }: { params: { _id: string } }) {
  return <ProfileLecturer params={params} />
}
