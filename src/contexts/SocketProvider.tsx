'use client'

import { useEffect } from 'react'

import { toast } from 'react-toastify'

import { io } from 'socket.io-client'

export default function SocketProvider() {
  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    if (!token) return

    // Kết nối tới WebSocket server
    const socket = io('https://vlustudy-production.up.railway.app', {
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
      console.log('🔔 Nhận thông báo:', data)
      toast.info('Bạn có thông báo mới', {
        autoClose: 3000,
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
