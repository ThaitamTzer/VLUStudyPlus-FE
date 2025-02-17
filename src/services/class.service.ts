import axiosClient from '@/libs/axios'
import type { Class, ClassType, FormClass } from '@/types/management/classType'

const classService = {
  getAll: async (
    page?: number,
    limit?: number,
    filterField?: string,
    filterValue?: string,
    sortField?: string,
    sortOrder?: string,
    typeList?: string,
    searchKey?: string
  ) => {
    const params = {
      ...(page && { page: page }),
      ...(limit && { limit: limit }),
      ...(filterField && { filterField: filterField }),
      ...(filterValue && { filterValue: filterValue }),
      ...(sortField && { sortField: sortField }),
      ...(sortOrder && { sortOrder: sortOrder }),
      ...(typeList && { typeList: typeList }),
      ...(searchKey && { searchKey: searchKey })
    }

    const response = await axiosClient.get('/api/class/view-list-class', { params })

    return response.data as ClassType
  },

  getDetail: async (id: string) => {
    const response = await axiosClient.get(`/api/class/${id}`)

    return response.data as Class
  },

  add: async (data: FormClass, sucessCallBack?: (res: any) => any, errorCallBack?: (res: any) => void) => {
    try {
      return await axiosClient.post('/api/class', data).then(res => {
        sucessCallBack && sucessCallBack(res)

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
    data: FormClass,
    successCallBack?: (res: any) => void,
    errorCallBack?: (res: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/class/${id}`, data).then(res => {
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

  delete: async (id: string, successCallBack?: (res: any) => void, errorCallBack?: (res: any) => void) => {
    try {
      return await axiosClient.delete(`/api/class/${id}`).then(res => {
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

  import: async (data: FormData, successCallBack?: (res: any) => void, errorCallBack?: (res: any) => void) => {
    try {
      return await axiosClient.post('/api/class/import-class', data).then(res => {
        successCallBack && successCallBack(res.data)

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

export default classService
