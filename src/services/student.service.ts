import axiosClient from '@/libs/axios'
import axiosUpload from '@/libs/axiosUpload'
import type { StudentType, FormStudent, UpdateStudent, StudentProfile } from '@/types/management/studentType'

const studentService = {
  getList: async (page?: number, limit?: number, filterField?: string, filterValue?: string, searchKey?: string) => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(filterField && { filterField }),
      ...(filterValue && { filterValue }),
      ...(searchKey && { searchKey })
    }

    const response = await axiosClient.get('/api/student/view-list-student', { params })

    return response.data as StudentType
  },

  getProfile: async () => {
    const response = await axiosClient.get('/api/student/view-my-profile')

    return response.data as StudentProfile
  },

  getOtherProfile: async (id: string) => {
    const response = await axiosClient.get(`/api/student/view-profile/${id}`)

    return response.data as StudentProfile
  },

  create: async (data: FormStudent, successCallBack?: (res: any) => void, errorCallBack?: (res: any) => void) => {
    try {
      return await axiosClient.post('/api/student', data).then(res => {
        successCallBack && successCallBack(res)

        return res
      })
    } catch (error) {
      if (errorCallBack) {
        errorCallBack(error)
      }

      return Promise.reject(error)
    }
  },

  update: async (
    id: string,
    data: UpdateStudent,
    successCallBack?: (res: any) => void,
    errorCallBack?: (res: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/student/${id}`, data).then(res => {
        successCallBack && successCallBack(res)

        return res
      })
    } catch (error) {
      if (errorCallBack) {
        errorCallBack(error)
      }

      return Promise.reject(error)
    }
  },

  block: async (
    id: string,
    status: boolean,
    successCallBack?: (res: any) => void,
    errorCallBack?: (res: any) => void
  ) => {
    try {
      return await axiosClient.patch(`/api/student/block-student/${id}`, { status }).then(res => {
        successCallBack && successCallBack(res)

        return res
      })
    } catch (error) {
      if (errorCallBack) {
        errorCallBack(error)
      }

      return Promise.reject(error)
    }
  },

  updateAvatar: async (data: FormData, successCallBack?: (res: any) => void, errorCallBack?: (res: any) => void) => {
    try {
      return await axiosUpload.patch(`/api/student/update-avatar`, data).then(res => {
        successCallBack && successCallBack(res)

        return res
      })
    } catch (error) {
      if (errorCallBack) {
        errorCallBack(error)
      }

      return Promise.reject(error)
    }
  }
}

export default studentService
