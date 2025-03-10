import { Card, CardContent, Grid, Typography } from '@mui/material'

import Iconify from '@/components/iconify'

export default function UserProfileContent({ user }: { user: any }) {
  return (
    <Grid container spacing={6}>
      <Grid item lg={4} md={5} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardContent className='flex flex-col gap-6'>
                <div className='flex flex-col gap-4'>
                  <Typography className='uppercase' variant='body2' color='text.disabled'>
                    Giới thiệu
                  </Typography>
                  <div className='flex items-center gap-2'>
                    <Iconify icon='solar:user-linear' width={27} />
                    <div className='flex items-center flex-wrap gap-2'>
                      <Typography className='font-medium'>Họ và tên:</Typography>
                      <Typography> {user?.userName}</Typography>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Iconify icon='solar:user-id-linear' width={27} />
                    <div className='flex items-center flex-wrap gap-2'>
                      <Typography className='font-medium'>
                        {user?.role?.name === 'Sinh viên' ? 'MSSV:' : 'Mã giảng viên:'}
                      </Typography>
                      <Typography> {user?.userId}</Typography>
                    </div>
                  </div>
                  {user?.classCode && (
                    <div className='flex items-center gap-2'>
                      <Iconify icon='icon-park-outline:system' width={27} />
                      <div className='flex items-center flex-wrap gap-2'>
                        <Typography className='font-medium'>Mã lớp:</Typography>
                        <Typography> {user?.classCode}</Typography>
                      </div>
                    </div>
                  )}
                  {user?.cohortId && (
                    <div className='flex items-center gap-2'>
                      <Iconify icon='hugeicons:student' width={27} />
                      <div className='flex items-center flex-wrap gap-2'>
                        <Typography className='font-medium'>Niên khóa:</Typography>
                        <Typography> {user?.cohortId}</Typography>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
