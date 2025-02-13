'use client'

import { useEffect, useRef } from 'react'

import { Stack, Typography } from '@mui/material'

import { useSettings } from '@/@core/hooks/useSettings'

import { useAuth } from '@/hooks/useAuth'
import Clock from '@/components/clock'

export default function HomePageView() {
  const { user } = useAuth()
  const settings = useSettings()
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current

    if (video) {
      const setPlaybackRate = () => {
        video.playbackRate = 0.85
      }

      video.addEventListener('loadeddata', setPlaybackRate)

      return () => video.removeEventListener('loadeddata', setPlaybackRate)
    }
  }, [])

  return (
    <div
      className='absolute -top-[71px] left-0 right-0 h-full'
      style={{
        height: 'calc(100% + 123px)'
      }}
    >
      <div
        className={`relative w-full h-full overflow-clip flex justify-center items-center ${!videoRef.current?.ended ? 'before:content-["*"]' : ''} before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:opacity-45 before:bg-custom-gradient before:z-[0]`}
      >
        <div className='w-[600px] h-24 mx-auto z-0'>
          <Stack justifyContent='center' alignItems='center' spacing={2}>
            <Typography
              sx={{
                fontSize: '2.5rem',
                color: 'white'
              }}
            >
              Xin chào 👋🏻
            </Typography>
            <Typography
              sx={{
                fontSize: '3rem',
                color: 'white'
              }}
            >
              {user?.userName.toUpperCase()}
            </Typography>
            <Typography
              sx={{
                fontSize: '1.5rem',
                color: 'white'
              }}
            >
              Chúc bạn một ngày tốt lành!
            </Typography>
            <Clock />
          </Stack>
        </div>
        <video
          ref={videoRef}
          className='absolute left-0 right-0 top-0 bottom-0 w-full h-full object-cover -z-[1]'
          autoPlay
          loop
          muted
          playsInline
          src={
            settings.settings.mode === 'light'
              ? 'https://res.cloudinary.com/dtvhqvucg/video/upload/v1739437477/banner2_loqzy3.mp4'
              : 'https://res.cloudinary.com/dtvhqvucg/video/upload/v1739437477/banner4_ii1hr0.mp4'
          }
        ></video>
      </div>
    </div>
  )
}
