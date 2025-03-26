'use client'

import { useEffect } from 'react'

import type { ToastContentProps } from 'react-toastify'
import { toast } from 'react-toastify'

import { io } from 'socket.io-client'
import cx from 'clsx'
import { mutate } from 'swr'

export default function SocketProvider() {
  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    if (!token) return

    // Kết nối tới WebSocket server
    const socket = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ['websocket'],
      auth: {
        token: `Bearer ${token}` // Gửi token vào auth header
      }
    }) // Thay đổi URL thành URL của WebSocket server của bạn

    // Lắng nghe sự kiện từ server
    socket.on('connect', () => {
      console.log('Connected to WebSocket server')
      socket.emit('subscribeAuthenticatedNotification')
    })

    socket.on('authenticatedNotification', data => {
      mutate('/api/notification/get-notification')
      toast(CustomNotification, {
        data: {
          title: data.title,
          content: data.message
        },
        autoClose: 5000,
        position: 'top-right'
      })
    })

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server')
    })

    // Cleanup khi component bị unmount
    return () => {
      socket.disconnect()
    }
  }, [])

  return null // Không cần UI, chỉ cần giữ kết nối WebSocket
}

type CustomNotificationProps = ToastContentProps & {
  data: {
    title: string
    content: string
  }
}

function CustomNotification({ data, toastProps }: CustomNotificationProps) {
  const isColored = toastProps.theme === 'colored'

  return (
    <div className='flex flex-col w-full'>
      <h3 className={cx('text-sm font-semibold', isColored ? 'text-white' : 'text-zinc-800')}>{data.title}</h3>
      <div className='flex items-center justify-between'>
        <p className='text-sm'>{data.content}</p>
      </div>
    </div>
  )
}
