import axiosClient from '@/libs/axios'
import type { ComimentFormDetailType, CommitmentFormListType } from '@/types/management/comimentFormType'

const commitmentFormService = {
  getByCategory: async (
    category: string | undefined,
    page?: number,
    limit?: number,
    filterField?: string,
    filterValue?: string,
    sortField?: string,
    sortOrder?: string,
    searchKey?: string
  ) => {
    const params = {
      ...(page && { page: page }),
      ...(limit && { limit: limit }),
      ...(filterField && { filterField: filterField }),
      ...(filterValue && { filterValue: filterValue }),
      ...(sortField && { sortField: sortField }),
      ...(sortOrder && { sortOrder: sortOrder }),
      ...(searchKey && { searchKey: searchKey })
    }

    const res = await axiosClient.get(`/api/commitment-form/get-all-commitment-form?category=${category}`, { params })

    return res.data as CommitmentFormListType
  },
  getByCategoryOfCVHT: async (
    category: string | undefined,
    page?: number,
    limit?: number,
    filterField?: string,
    filterValue?: string,
    sortField?: string,
    sortOrder?: string,
    searchKey?: string
  ) => {
    const params = {
      ...(page && { page: page }),
      ...(limit && { limit: limit }),
      ...(filterField && { filterField: filterField }),
      ...(filterValue && { filterValue: filterValue }),
      ...(sortField && { sortField: sortField }),
      ...(sortOrder && { sortOrder: sortOrder }),
      ...(searchKey && { searchKey: searchKey })
    }

    const res = await axiosClient.get(`/api/commitment-form/get-all-commitment-form-of-CVHT?category=${category}`, {
      params
    })

    return res.data as CommitmentFormListType
  },

  getDetail: async (id: string) => {
    const res = await axiosClient.get(`/api/commitment-form/get-commitment-form/${id}`)

    return res.data as ComimentFormDetailType
  },

  updateStatus: async (
    id: string,
    data: { approveStatus: string },
    sucessCallback?: (res: any) => void,
    errorCallback?: (res: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/commitment-form/update-status-commitment-form/${id}`, data).then(res => {
        if (sucessCallback) {
          sucessCallback(res.data)
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

  updateForm: async (
    id: string,
    data: any,
    sucessCallback?: (res: any) => void,
    errorCallback?: (res: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/commitment-form/update-commitment-form/${id}`, data).then(res => {
        if (sucessCallback) {
          sucessCallback(res.data)
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

  deleteForm: async (id: string, sucessCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.delete(`/api/commitment-form/delete-commitment-form/${id}`).then(res => {
        if (sucessCallback) {
          sucessCallback(res.data)
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

export default commitmentFormService
