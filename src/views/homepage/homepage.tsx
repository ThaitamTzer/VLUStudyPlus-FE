'use client'

import Image from 'next/image'

import { Card, Stack, Typography } from '@mui/material'

import { useAuth } from '@/hooks/useAuth'

export default function HomePageView() {
  const { user } = useAuth()

  return (
    <Card>
      <div className='px-6 py-8 md:px-10 md:py-12'>
        <Stack spacing={1}>
          <Typography variant='h3'>
            Chào, <span className='font-semibold text-primary'>{user?.userName}</span>! 👋
          </Typography>
          <Typography variant='h4'>Chúc bạn một ngày tốt lành!</Typography>
        </Stack>
        <div className='flex flex-1'>
          <Image
            src='/images/background/img_welcome.svg'
            alt='background-welcome'
            width={500}
            height={500}
            quality={100}
            priority
            className='mx-auto w-[45%] h-auto'
          />
        </div>
      </div>
    </Card>
  )
}
