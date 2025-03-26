import axiosClient from '@/libs/axios'

const mailService = {
  async sendMail(academicCategoryId: string, successCallback?: (res: any) => void, errorCallback?: (err: any) => void) {
    try {
      return await axiosClient.post(`/api/notification/sendMail/${academicCategoryId}`).then(res => {
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

  async remindMail(
    academicCategoryId: string,
    data: any,
    successCallback?: (res: any) => void,
    errorCallback?: (err: any) => void
  ) {
    try {
      return await axiosClient.post(`/api/notification/sendMailRemind/${academicCategoryId}`, data).then(res => {
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
  }
}

export default mailService
