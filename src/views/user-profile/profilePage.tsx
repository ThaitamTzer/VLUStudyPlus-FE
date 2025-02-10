'use client'

import { Grid } from '@mui/material'

import { useAuth } from '@/hooks/useAuth'
import UserProfileHeader from './userProfileHeader'
import UserProfileContent from './userProfileContent'
import UpdateAvatar from './updateAvatar'
import ViewAvatar from './viewAvatar'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <UserProfileHeader user={user} />
        </Grid>
        <Grid item xs={12} className='flex flex-col gap-6'>
          <UserProfileContent user={user} />
        </Grid>
      </Grid>
      <UpdateAvatar />
      <ViewAvatar user={user} />
    </>
  )
}
