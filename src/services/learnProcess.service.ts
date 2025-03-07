import axiosClient from '@/libs/axios'
import axiosUpload from '@/libs/axiosUpload'
import type {
  AddProcessType,
  CheckAcademicProcessing,
  ImportResult,
  LearnProcessType,
  ListProcessingType
} from '@/types/management/learnProcessType'

const learnProcessService = {
  import: async (data: FormData, sucessCallback?: (res: ImportResult) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosUpload.post('/api/academic-processing/import', data).then(res => {
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

  create: async (data: { title: string }, sucessCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.post('/api/academic-processing/create-aca-session', data).then(res => {
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

  getAll: async () => {
    const res = await axiosClient.get('/api/academic-processing/get-aca-session')

    return res.data as LearnProcessType[]
  },

  update: async (
    id: string,
    data: { title: string },
    sucessCallback?: (res: any) => void,
    errorCallback?: (res: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/academic-processing/aca-session/${id}`, data).then(res => {
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

  deleteAll: async (id: string, sucessCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.delete(`/api/academic-processing/delete-academic-session/${id}`).then(res => {
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

  addProcess: async (
    data: any | AddProcessType,
    sucessCallback?: (res: any) => void,
    errorCallback?: (res: any) => void
  ) => {
    try {
      return await axiosClient.post('/api/academic-processing/create-academicProcessing', data).then(res => {
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

  updateProcess: async (
    id: string,
    data: any,
    sucessCallback?: (res: any) => void,
    errorCallback?: (res: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/academic-processing/update-academicProcessing/${id}`, data).then(res => {
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

  deleteProcess: async (id: string, sucessCallback?: (res: any) => void, errorCallback?: (res: any) => void) => {
    try {
      return await axiosClient.delete(`/api/academic-processing/delete-academicProcessing/${id}`).then(res => {
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

  viewProcessByCategory: async (
    id: string,
    page?: number,
    limit?: number,
    filterField?: string,
    filterValue?: string,
    sortField?: string,
    sortOrder?: string,
    searchKey?: string
  ) => {
    const params = {
      ...(page && { page }),
      ...(limit && { limit }),
      ...(filterField && { filterField }),
      ...(filterValue && { filterValue }),
      ...(sortField && { sortField }),
      ...(sortOrder && { sortOrder }),
      ...(searchKey && { searchKey })
    }

    const res = await axiosClient.get(`/api/academic-processing/view-list-academicProcessing-of-category?id=${id}`, {
      params
    })

    return res.data as ListProcessingType
  },

  viewDetailProcess: async (id: string) => {
    const res = await axiosClient.get(`/api/academic-processing/view-academicProcessing/${id}`)

    return res.data as CheckAcademicProcessing
  }
}

export default learnProcessService
