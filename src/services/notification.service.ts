import axiosClient from '@/libs/axios'
import type { NotificationType } from '@/types/management/notificationType'

const notificationService = {
  getAll: async () => {
    const res = await axiosClient.get('/api/notification/get-notification')

    return res.data as NotificationType[]
  },

  update: async (id: string, successCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.patch(`/api/notification/update-notification?notificationId=${id}`).then(res => {
        if (successCallback) {
          successCallback(res)
        }

        return res.data
      })
    } catch (error) {
      if (errorCallback) {
        errorCallback(error)
      }

      return Promise.reject(error)
    }
  }
}

export default notificationService
