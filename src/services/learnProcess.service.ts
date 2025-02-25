import axiosClient from '@/libs/axios'
import axiosUpload from '@/libs/axiosUpload'
import type { LearnProcessType } from '@/types/management/learnProcessType'

const learnProcessService = {
  import: async (data: FormData, sucessCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosUpload.post('/api/academic-processing/import', data).then(res => {
        if (sucessCallback) {
          sucessCallback(res.data)
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

  create: async (data: { title: string }, sucessCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.post('/api/academic-processing/create-aca-session', data).then(res => {
        if (sucessCallback) {
          sucessCallback(res.data)
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

  getAll: async () => {
    const res = await axiosClient.get('/api/academic-processing/get-aca-session')

    return res.data as LearnProcessType[]
  },

  update: async (
    id: string,
    data: { title: string },
    sucessCallback?: (res: any) => void,
    errorCallback?: (res: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/academic-processing/aca-session/${id}`, data).then(res => {
        if (sucessCallback) {
          sucessCallback(res.data)
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

  delete: async (id: string, sucessCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.delete(`/api/academic-processing/${id}`).then(res => {
        if (sucessCallback) {
          sucessCallback(res.data)
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

export default learnProcessService
