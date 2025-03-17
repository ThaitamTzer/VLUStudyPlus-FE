import axiosClient from '@/libs/axios'
import axiosUpload from '@/libs/axiosUpload'
import type { CommitmentForm } from '@/types/management/comimentFormType'
import type { ProcessingType } from '@/types/management/learnProcessType'

const studentAcedemicProcessService = {
  getStudentAcedemicProcess: async () => {
    const response = await axiosClient.get(`/api/academic-processing/view-list-academicProcessing-of-student`)

    return response.data as ProcessingType[]
  },

  getCommitmentForm: async (id: string) => {
    const res = await axiosClient.get(`/api/commitment-form/get-commitment-form-of-student/${id}`)

    return res.data as CommitmentForm
  },

  addCommitmentForm: async (
    id: string,
    data: any,
    successCallBack?: (res: any) => void,
    errorCallBack?: (error: any) => void
  ) => {
    try {
      return await axiosClient.post(`/api/commitment-form/create-commitment-form/${id}`, data).then(res => {
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

  updateCommitmentForm: async (
    id: string,
    data: any,
    successCallBack?: (res: any) => void,
    errorCallBack?: (error: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/commitment-form/update-commitment-form/${id}`, data).then(res => {
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

  deleteCommitmentForm: async (
    id: string,
    successCallBack?: (res: any) => void,
    errorCallBack?: (error: any) => void
  ) => {
    try {
      return await axiosClient.delete(`/api/commitment-form/delete-commitment-form/${id}`).then(res => {
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

  addSignature: async (
    id: string,
    data: FormData,
    successCallBack?: (res: any) => void,
    errorCallBack?: (error: any) => void
  ) => {
    try {
      return await axiosUpload.patch(`/api/commitment-form/instert-signature-for-student/${id}`, data).then(res => {
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

export default studentAcedemicProcessService
