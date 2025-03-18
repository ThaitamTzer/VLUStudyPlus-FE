import { create } from 'zustand'
import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'

interface SocketState {
  socket: Socket | null
  notifications: any[]
  connect: (token: string) => void
  disconnect: () => void
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  notifications: [],

  connect: token => {
    if (get().socket) return // Tránh kết nối lại nhiều lần

    const socketInstance = io('https://vlustudy-production.up.railway.app', {
      transports: ['websocket'],
      auth: { token: `Bearer ${token}` } // Gửi token vào auth header,
    })

    socketInstance.on('connect', () => {
      console.log('✅ Đã kết nối đến WebSocket Server')
      socketInstance.emit('subscribeAuthenticatedNotification')
    })

    socketInstance.on('authenticatedNotification', data => {
      console.log('🔔 Nhận thông báo:', data)
      set(state => ({
        notifications: [...state.notifications, data]
      }))
    })

    socketInstance.on('disconnect', () => {
      console.log('❌ WebSocket bị ngắt kết nối')
    })

    set({ socket: socketInstance })
  },

  disconnect: () => {
    get().socket?.disconnect()
    set({ socket: null })
  }
}))
