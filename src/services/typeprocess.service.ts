import axiosClient from '@/libs/axios'
import type { AddTypeProcessInput, TypeProcessType } from '@/types/management/typeProcessType'

const typeProcessService = {
  getAll: async () => {
    const res = await axiosClient.get('/api/type-processing')

    return res.data as TypeProcessType[]
  },

  add: async (data: AddTypeProcessInput, successCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.post('/api/type-processing', data).then(res => {
        if (successCallback) {
          successCallback(res)
        }

        return res
      })
    } catch (error) {
      if (errorCallback) {
        errorCallback(error)
      }

      return Promise.reject(error)
    }
  },

  update: async (
    id: string,
    data: { typeProcessingId: string; typeProcessingName: string },
    successCallback?: (res: any) => void,
    errorCallback?: (res: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/type-processing/${id}`, data).then(res => {
        if (successCallback) {
          successCallback(res)
        }

        return res
      })
    } catch (error) {
      if (errorCallback) {
        errorCallback(error)
      }

      return Promise.reject(error)
    }
  },

  delete: async (id: string, successCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.delete(`/api/type-processing/${id}`).then(res => {
        if (successCallback) {
          successCallback(res)
        }

        return res
      })
    } catch (error) {
      if (errorCallback) {
        errorCallback(error)
      }

      return Promise.reject(error)
    }
  }
}

export default typeProcessService
