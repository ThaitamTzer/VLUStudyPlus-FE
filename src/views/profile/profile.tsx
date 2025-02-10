'use client'

import { useRouter } from 'next/navigation'

import useSWR from 'swr'

import { Button, Grid } from '@mui/material'

import studentService from '@/services/student.service'
import UserProfileHeader from '../user-profile/userProfileHeader'
import UserProfileContent from '../user-profile/userProfileContent'
import UpdateAvatar from '../user-profile/updateAvatar'
import ViewAvatar from '../user-profile/viewAvatar'
import { SplashScreen } from '@/components/loading-screen'
import Iconify from '@/components/iconify'

export default function ProfileStudent({ params }: { params: { id: string } }) {
  const router = useRouter()

  const { data: student, isLoading } = useSWR(['student', params.id], () => studentService.getOtherProfile(params.id))

  if (isLoading) return <SplashScreen />

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Button startIcon={<Iconify icon='tabler:arrow-left' />} variant='contained' onClick={() => router.back()}>
            Quay lại
          </Button>
        </Grid>
        <Grid item xs={12}>
          <UserProfileHeader user={student} />
        </Grid>
        <Grid item xs={12} className='flex flex-col gap-6'>
          <UserProfileContent user={student} />
        </Grid>
      </Grid>
      <UpdateAvatar />
      <ViewAvatar user={student} />
    </>
  )
}
