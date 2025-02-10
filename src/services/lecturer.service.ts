import axiosClient from '@/libs/axios'
import axiosUpload from '@/libs/axiosUpload'
import type { FormLecturer, LecturerProfile, LecturerType } from '@/types/management/lecturerType'

const lecturerService = {
  getAll: async (page?: number, limit?: number, filterField?: string, filterValue?: string, searchKey?: string) => {
    const params = {
      ...(page && { page: page }),
      ...(limit && { limit: limit }),
      ...(filterField && { filterField: filterField }),
      ...(filterValue && { filterValue: filterValue }),
      ...(searchKey && { searchKey: searchKey })
    }

    const response = await axiosClient.get('/api/lecturer/view-list-lecturer', { params })

    return response.data as LecturerType
  },

  getProfile: async () => {
    const response = await axiosClient.get('/api/lecturer/view-my-profile')

    return response.data as LecturerProfile
  },

  getOtherProfile: async (id: string) => {
    const response = await axiosClient.get(`/api/lecturer/view-profile/${id}`)

    return response.data as LecturerProfile
  },

  import: async (data: FormData, successCallBack?: (res: any) => void, errorCallBack?: (res: any) => void) => {
    try {
      return await axiosUpload.post('/api/lecturer/import-lecturer', data).then(res => {
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
      return await axiosUpload.patch('/api/lecturer/update-avatar', data).then(res => {
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

  create: async (data: FormLecturer, successCallBack?: (res: any) => void, errorCallBack?: (res: any) => void) => {
    try {
      return await axiosClient.post('/api/lecturer', data).then(res => {
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
    data: FormLecturer,
    successCallBack?: (res: any) => void,
    errorCallBack?: (res: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/lecturer/${id}`, data).then(res => {
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
      return await axiosClient.patch(`/api/lecturer/block-lecturer/${id}`, { status }).then(res => {
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

export default lecturerService
