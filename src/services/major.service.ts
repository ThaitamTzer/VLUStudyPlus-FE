import axiosClient from '@/libs/axios'
import type { Concentration, Major, MajorForm, MajorRes } from '@/types/management/majorType'

const majorService = {
  getAll: async (page?: number, limit?: number, filterField?: string, filterValue?: string, searchKey?: string) => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(filterField && { filterField }),
      ...(filterValue && { filterValue }),
      ...(searchKey && { searchKey })
    }

    const res = await axiosClient.get('/api/major/view-list-major', { params })

    return res.data as MajorRes
  },

  getMajor: async (id: string) => {
    const res = await axiosClient.get(`/api/major/${id}`)

    return res.data as Major
  },

  create: async (data: MajorForm, successCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.post('/api/major', data).then(res => {
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

  update: async (id: string, data: any, successCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.put(`/api/major/${id}`, data).then(res => {
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
      return await axiosClient.delete(`/api/major/${id}`).then(res => {
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

  getConcerntrationByMajor: async (majorId: string) => {
    const res = await axiosClient.get(`/api/major/view-list-concentration/${majorId}`)

    return res.data as Concentration[]
  },

  createConcentration: async (data: any, successCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.post('/api/major/add-concentration', data).then(res => {
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

  updateConcentration: async (
    id: string,
    data: any,
    successCallback?: (res: any) => void,
    errorCallback?: (res: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/major/update-concentration/${id}`, data).then(res => {
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

  deleteConcentration: async (id: string, successCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.delete(`/api/major/delete-concentration/${id}`).then(res => {
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

export default majorService
