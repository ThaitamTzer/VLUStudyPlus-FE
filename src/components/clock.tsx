'use client'

import { useState, useEffect } from 'react'

import spacetime from 'spacetime'
import { Typography } from '@mui/material'

export default function Clock() {
  const [currentTime, setCurrentTime] = useState(spacetime.now().goto('Asia/Ho_Chi_Minh'))

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(spacetime.now().goto('Asia/Ho_Chi_Minh'))
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const getFullDate = () => {
    const date = currentTime.date()
    const month = currentTime.month()
    const year = currentTime.year()

    return {
      date,
      month,
      year
    }
  }

  return (
    <div className='flex'>
      <Typography
        sx={{
          fontSize: '1.5rem',
          color: 'white'
        }}
      >
        {currentTime.format('time-24')}:{currentTime.format('second-pad')} - HCM, Ngày {getFullDate().date} Tháng{' '}
        {getFullDate().month + 1} Năm {getFullDate().year}
      </Typography>
    </div>
  )
}
