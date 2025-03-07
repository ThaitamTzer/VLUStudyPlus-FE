import axiosClient from '@/libs/axios'

const resultProcessService = {
  getAll: async () => {
    const res = await axiosClient.get('/api/processing-result')

    return res.data
  },

  create: async (
    data: { processingResultName: string },
    sucessCallback?: (res: any) => void,
    errorCallback?: (res: any) => void
  ) => {
    try {
      return await axiosClient.post('/api/processing-result', data).then(res => {
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

  update: async (
    id: string,
    data: { processingResultName: string },
    sucessCallback?: (res: any) => void,
    errorCallback?: (res: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/processing-result/${id}`, data).then(res => {
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
      return await axiosClient.delete(`/api/processing-result/${id}`).then(res => {
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

export default resultProcessService
