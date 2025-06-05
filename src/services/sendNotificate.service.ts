import axiosClient from '@/libs/axios'
import type { MailHistoryType, MailHistoryTypeForCHVT } from '@/types/management/mailHistoryType'

const sendNotificateService = {
  sendMailForStudent: async (data: any, successCallback?: (res: any) => void, errorCallback?: (err: any) => void) => {
    try {
      return await axiosClient.post('/api/notification/sendMailForStudent', data).then(res => {
        if (successCallback) {
          successCallback(res)

          return res.data
        }
      })
    } catch (error) {
      if (errorCallback) {
        errorCallback(error)
      }

      return Promise.reject(error)
    }
  },

  getHistoryMailForCHVT: async (startDate?: string, endDate?: string, search?: string) => {
    const params = {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(search && { search })
    }

    const res = await axiosClient.get('/api/notification/get-history-email-for-CVHT', { params })

    return res.data as MailHistoryTypeForCHVT[]
  },

  getHistoryMail: async (startDate?: string, endDate?: string, search?: string) => {
    const params = {
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(search && { search })
    }

    const res = await axiosClient.get('/api/notification/get-history-email', { params })

    return res.data as MailHistoryType[]
  }
}

export default sendNotificateService
