import axiosClient from '@/libs/axios'

const subjectServices = {
  createSubject: async (
    SSId: string,
    cateId: string,
    data: any,
    successCallback?: (res: any) => void,
    errorCallback?: (err: any) => void
  ) => {
    try {
      return await axiosClient
        .post(`/api/subject/create-subject-in-training-program/${SSId}/${cateId}`, data)
        .then(res => {
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

  deleteSubject: async (
    id: string,
    data: any,
    successCallback?: (res: any) => void,
    errorCallback?: (err: any) => void
  ) => {
    try {
      return await axiosClient.delete(`/api/subject/delete-subject/${id}`, { data }).then(res => {
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
