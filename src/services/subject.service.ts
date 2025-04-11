import axiosClient from '@/libs/axios'

const subjectServices = {
  createSubject: async (data: any, successCallback?: (res: any) => void, errorCallback?: (err: any) => void) => {
    try {
      return await axiosClient.post('/api/subject/create-subject', data).then(res => {
        successCallback && successCallback(res.data)

        return res
      })
    } catch (error) {
      errorCallback && errorCallback(error)

      return Promise.reject(error)
    }
  },

  updateSubject: async (
    id: string,
    data: any,
    successCallback?: (res: any) => void,
    errorCallback?: (err: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/subject/update-subject/${id}`, data).then(res => {
        successCallback && successCallback(res.data)

        return res
      })
    } catch (error) {
      errorCallback && errorCallback(error)

      return Promise.reject(error)
    }
  },

  deleteSubject: async (id: string, successCallback?: (res: any) => void, errorCallback?: (err: any) => void) => {
    try {
      return await axiosClient.delete(`/api/subject/delete-subject/${id}`).then(res => {
        successCallback && successCallback(res.data)

        return res
      })
    } catch (error) {
      errorCallback && errorCallback(error)

      return Promise.reject(error)
    }
  }
}

export default subjectServices
