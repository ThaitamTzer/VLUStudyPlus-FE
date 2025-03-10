'use client'

import { Button, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material'

import { useStudentStore } from '@/stores/student/student'
import { useAuth } from '@/hooks/useAuth'

import Iconify from '@/components/iconify'

type UserProfileHeaderProps = {
  user: any | null
}

export default function UserProfileHeader({ user }: UserProfileHeaderProps) {
  const { toogleViewAvatar, toogleUpdateAvatar } = useStudentStore()
  const { user: currentUser } = useAuth()

  console.log(user)

  return (
    <Card>
      <CardMedia image='/images/background/cover_bg.jpg' className='bs-[250px]' />
      <CardContent className='flex gap-5 justify-center flex-col items-center md:items-end md:flex-row !pt-0 md:justify-start'>
        <div className='flex rounded-bs-md mbs-[-40px] border-[5px] mis-[-5px] border-be-0  border-backgroundPaper bg-backgroundPaper relative'>
          <div className='absolute top-0 left-0 right-0 bottom-0 hover:bg-slate-500/20 flex justify-center items-center group'>
            <Stack spacing={1}>
              <Button
                variant='contained'
                size='small'
                className='invisible group-hover:visible'
                startIcon={<Iconify icon='tabler:eye' />}
                onClick={toogleViewAvatar}
              >
                Xem
              </Button>
              {currentUser?._id === user?._id && (
                <Button
                  variant='contained'
                  size='small'
                  className='invisible group-hover:visible'
                  startIcon={<Iconify icon='tabler:edit' />}
                  onClick={toogleUpdateAvatar}
                >
                  Thay đổi
                </Button>
              )}
            </Stack>
          </div>
          <img height={120} width={120} src={user?.avatar} className='rounded' alt='Profile Background' />
        </div>
        <div className='flex is-full justify-start self-end flex-col items-center gap-6 sm-gap-0 sm:flex-row sm:justify-between sm:items-end '>
          <div className='flex flex-col items-center sm:items-start gap-2'>
            <Typography variant='h4'>{user?.userName}</Typography>
            <div className='flex flex-wrap gap-6 justify-center sm:justify-normal'>
              <div className='flex items-center gap-2'>
                <Iconify icon='solar:user-outline' />
                <Typography className='font-medium'>{user?.role?.name || 'Chưa phân quyền'}</Typography>
              </div>
              <div className='flex items-center gap-2'>
                <Iconify icon='tabler:mail' />
                <Typography className='font-medium'>{user?.mail}</Typography>
              </div>
            </div>
          </div>
          {user?.isBlock ? (
            <Button variant='contained' color='error' className='flex gap-2'>
              <i className='tabler-user-x !text-base'></i>
              <span>Tài khoản đã bị khóa</span>
            </Button>
          ) : (
            <Button variant='contained' className='flex gap-2'>
              <i className='tabler-user-check !text-base'></i>
              <span>Hoạt động</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
