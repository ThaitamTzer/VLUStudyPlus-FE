import axiosClient from '@/libs/axios'
import type { Cohort, CohortForm } from '@/types/management/cohortType'

const cohortService = {
  getAll: async (): Promise<Cohort[]> => {
    const response = await axiosClient.get('/api/cohort')

    return response.data as Cohort[]
  },

  create: async (data: CohortForm, successCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.post('/api/cohort', data).then(res => {
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
    data: CohortForm,
    successCallback?: (res: any) => void,
    errorCallback?: (res: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/cohort/${id}`, data).then(res => {
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
      return await axiosClient.delete(`/api/cohort/${id}`).then(res => {
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

export default cohortService
