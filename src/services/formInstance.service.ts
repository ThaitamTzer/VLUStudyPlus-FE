import axiosClient from '@/libs/axios'
import axiosUpload from '@/libs/axiosUpload'
import type { FormInstanceType } from '@/types/management/formInstanceType'

const formInstanceService = {
  getFormDetail_BCNK: async (id: string) => {
    const res = await axiosClient.get(`/api/form-instance/detail-BCNK/${id}`)

    return res.data as FormInstanceType
  },

  getFormDetail_Student: async (id: string) => {
    const res = await axiosClient.get(`/api/form-instance/detail-SV/${id}`)

    return res.data as FormInstanceType
  },

  createForm: async (
    id: string,
    data: any,
    successCallBack?: (res: any) => void,
    errorCallBack?: (err: any) => void
  ) => {
    try {
      return await axiosClient.post(`/api/form-instance/create-form/${id}`, data).then(res => {
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

  updateForm: async (
    id: string,
    data: any,
    successCallBack?: (res: any) => void,
    errorCallBack?: (err: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/form-instance/${id}`, data).then(res => {
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

  deleleForm: async (id: string, successCallBack?: (res: any) => void, errorCallBack?: (err: any) => void) => {
    try {
      return await axiosClient.delete(`/api/form-instance/delete-form-instance/${id}`).then(res => {
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

  approveForm: async (
    id: string,
    data: any,
    successCallBack?: (res: any) => void,
    errorCallBack?: (err: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/form-instance/approve/${id}`, data).then(res => {
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

  inSertSignature: async (
    id: string,
    data: FormData,
    successCallBack?: (res: any) => void,
    errorCallBack?: (err: any) => void
  ) => {
    try {
      return await axiosUpload.post(`/api/form-instance/insert-signature-for-student/${id}`, data).then(res => {
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
  }
}

export default formInstanceService
