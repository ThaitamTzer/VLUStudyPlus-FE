import axiosClient from '@/libs/axios'
import type { FormTemplateType } from '@/types/management/formTemplateType'

const formTemplateService = {
  getAllFormTemplate: async () => {
    const res = await axiosClient.get('/api/form-template')

    return res.data as FormTemplateType[]
  },

  getFormTemplateById: async (id: string) => {
    const res = await axiosClient.get(`/api/form-template/${id}`)

    return res.data as FormTemplateType
  },

  createFormTemplate: async (data: any, successCallback?: (res: any) => void, errorCallback?: (err: any) => void) => {
    try {
      return await axiosClient.post('/api/form-template', data).then(res => {
        if (successCallback) {
          successCallback(res.data)
        }

        return res.data
      })
    } catch (err) {
      if (errorCallback) {
        errorCallback(err)
      }

      return Promise.reject(err)
    }
  },

  updateFormTemplate: async (
    id: string,
    data: any,
    successCallback?: (res: any) => void,
    errorCallback?: (err: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/form-template/${id}`, data).then(res => {
        if (successCallback) {
          successCallback(res.data)
        }

        return res.data
      })
    } catch (err) {
      if (errorCallback) {
        errorCallback(err)
      }

      return Promise.reject(err)
    }
  },

  deleteFormTemplate: async (id: string, successCallback?: (res: any) => void, errorCallback?: (err: any) => void) => {
    try {
      return await axiosClient.delete(`/api/form-template/${id}/delete`).then(res => {
        if (successCallback) {
          successCallback(res.data)
        }

        return res.data
      })
    } catch (err) {
      if (errorCallback) {
        errorCallback(err)
      }

      return Promise.reject(err)
    }
  }
}

export default formTemplateService
