import axiosClient from '@/libs/axios'
import axiosUpload from '@/libs/axiosUpload'
import type { TrainingProgramByFrame, TrainingProgramListType } from '@/types/management/trainningProgramType'

const trainingProgramService = {
  getAll: async (page?: number, limit?: number, filterField?: string, filterValue?: string, searchKey?: string) => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(filterField && { filterField }),
      ...(filterValue && { filterValue }),
      ...(searchKey && { searchKey })
    }

    const res = await axiosClient.get('/api/training-program/view-all-training-program-session', { params })

    return res.data as TrainingProgramListType
  },

  create: async (data: any, successCallBack?: (res: any) => void, errorCallBack?: (res: any) => void) => {
    try {
      return await axiosClient.post('/api/training-program', data).then(res => {
        if (successCallBack) {
          successCallBack(res)
        }

        return res
      })
    } catch (error) {
      if (errorCallBack) {
        errorCallBack(error)
      }

      return Promise.reject(error)
    }
  },

  update: async (id: string, data: any, successCallBack?: (res: any) => void, errorCallBack?: (res: any) => void) => {
    try {
      return await axiosClient.put(`/api/training-program/update-training-program-session/${id}`, data).then(res => {
        if (successCallBack) {
          successCallBack(res)
        }

        return res
      })
    } catch (error) {
      if (errorCallBack) {
        errorCallBack(error)
      }

      return Promise.reject(error)
    }
  },

  delete: async (id: string, successCallBack?: (res: any) => void, errorCallBack?: (res: any) => void) => {
    try {
      return await axiosClient.delete(`/api/training-program/delete-training-program-session/${id}`).then(res => {
        if (successCallBack) {
          successCallBack(res)
        }

        return res
      })
    } catch (error) {
      if (errorCallBack) {
        errorCallBack(error)
      }

      return Promise.reject(error)
    }
  },

  import: async (
    id: string,
    data: FormData,
    successCallBack?: (res: any) => void,
    errorCallBack?: (res: any) => void
  ) => {
    try {
      return await axiosUpload.post(`/api/training-program/import-training-program-session/${id}`, data).then(res => {
        successCallBack && successCallBack(res.data)

        return res
      })
    } catch (error) {
      if (errorCallBack) {
        errorCallBack(error)
      }

      return Promise.reject(error)
    }
  },

  getTrainingProgramByFrame: async (id: string) => {
    const res = await axiosClient.get(`/api/training-program/view-training-program/${id}`)

    return res.data as TrainingProgramByFrame[]
  }
}

export default trainingProgramService
