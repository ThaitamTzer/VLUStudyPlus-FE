import axiosClient from '@/libs/axios'

import type { AddTermType, Term, TermType, UpdateTermType } from '@/types/management/termType'

const termService = {
  getAll: async (
    page?: number,
    limit?: number,
    filterField?: string,
    filterValue?: string,
    startDate?: string,
    endDate?: string,
    academicYear?: string,
    searchKey?: string
  ): Promise<TermType> => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(filterField && { filterField }),
      ...(filterValue && { filterValue }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(academicYear && { academicYear }),
      ...(searchKey && { searchKey })
    }

    const res = await axiosClient.get('/api/term/view-list-term', { params })

    return res.data
  },

  getTerm: async (id: string): Promise<Term> => {
    const res = await axiosClient.get(`/api/term/${id}`)

    return res.data
  },

  create: async (data: AddTermType, successCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.post('api/term', data).then(res => {
        if (successCallback) {
          successCallback(res)
        }

        return res
      })
    } catch (error) {
      if (errorCallback) {
        console.log(error)
        errorCallback(error)
      }

      return Promise.reject(error)
    }
  },

  update: async (
    id: string,
    data: UpdateTermType,
    successCallback?: (res: any) => void,
    errorCallback?: (res: any) => void
  ) => {
    try {
      return await axiosClient.put(`api/term/${id}`, data).then(res => {
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
      return await axiosClient.delete(`api/term/${id}`).then(res => {
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

export default termService
