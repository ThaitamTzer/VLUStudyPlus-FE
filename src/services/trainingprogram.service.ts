import axiosClient from '@/libs/axios'
import axiosUpload from '@/libs/axiosUpload'
import type { CompareBeforeImportType } from '@/types/management/compareBeforImportType'
import type {
  ResCreateFrame,
  TrainingProgramByFrame,
  TrainingProgramListType
} from '@/types/management/trainningProgramType'

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

  create: async (data: any, successCallBack?: (res: ResCreateFrame) => void, errorCallBack?: (res: any) => void) => {
    try {
      return await axiosClient.post('/api/training-program', data).then(res => {
        if (successCallBack) {
          successCallBack(res.data)
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
  },

  createCategory1: async (
    id: string,
    data: any,
    successCallBack?: (res: any) => void,
    errorCallBack?: (res: any) => void
  ) => {
    try {
      return await axiosClient.post(`/api/training-program/create-category-1/${id}`, data).then(res => {
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

  addCategory2: async (
    id: string,
    data: any,
    successCallBack?: (res: any) => void,
    errorCallBack?: (res: any) => void
  ) => {
    try {
      return await axiosClient.post(`/api/training-program/create-category-2/${id}`, data).then(res => {
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

  addCategory3: async (
    cateId1: string,
    cateId2: string,
    data: any,
    successCallBack?: (res: any) => void,
    errorCallBack?: (res: any) => void
  ) => {
    try {
      return await axiosClient.post(`/api/training-program/create-category-3/${cateId1}/${cateId2}`, data).then(res => {
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

  updateCategory1: async (
    id: string,
    data: any,
    successCallBack?: (res: any) => void,
    errorCallBack?: (res: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/training-program/update-category-1/${id}`, data).then(res => {
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

  updateCategory2: async (
    idC1: string,
    idC2: string,
    data: any,
    successCallBack?: (res: any) => void,
    errorCallBack?: (res: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/training-program/update-category-2/${idC1}/${idC2}`, data).then(res => {
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

  updateCategory3: async (
    idC1: string,
    idC2: string,
    idC3: string,
    data: any,
    successCallBack?: (res: any) => void,
    errorCallBack?: (res: any) => void
  ) => {
    try {
      return await axiosClient
        .put(`/api/training-program/update-category-3/${idC1}/${idC2}/${idC3}`, data)
        .then(res => {
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

  deleteCate1: async (
    id: string,
    reason: string,
    successCallBack?: (res: any) => void,
    errorCallBack?: (res: any) => void
  ) => {
    try {
      return await axiosClient
        .delete(`/api/training-program/delete-category-1/${id}`, {
          data: { reason }
        })
        .then(res => {
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

  deleteCate2: async (
    idC1: string,
    idC2: string,
    reason: string,
    successCallBack?: (res: any) => void,
    errorCallBack?: (res: any) => void
  ) => {
    try {
      return await axiosClient
        .delete(`/api/training-program/delete-category-2/${idC1}/${idC2}`, {
          data: { reason }
        })
        .then(res => {
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
  deleteCate3: async (
    idC1: string,
    idC2: string,
    idC3: string,
    reason: string,
    successCallBack?: (res: any) => void,
    errorCallBack?: (res: any) => void
  ) => {
    try {
      return await axiosClient
        .delete(`/api/training-program/delete-category-3/${idC1}/${idC2}/${idC3}`, {
          data: { reason }
        })
        .then(res => {
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

  compareDataBeforeImport: async (
    id: string,
    data: FormData,
    successCallBack?: (res: CompareBeforeImportType) => void,
    errorCallBack?: (res: any) => void
  ) => {
    try {
      return await axiosUpload.post(`/api/training-program/compare-training-program/${id}`, data).then(res => {
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

export default trainingProgramService
