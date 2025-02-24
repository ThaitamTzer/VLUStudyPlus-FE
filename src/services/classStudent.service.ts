import axiosClient from '@/libs/axios'
import axiosUpload from '@/libs/axiosUpload'
import type { ImportStudentResult } from '@/types/management/classStudentType'

const classStudentService = {
  import: async (
    data: FormData,
    sucessCallBack?: (res: ImportStudentResult) => void,
    errorCallBack?: (err: any) => void
  ) => {
    try {
      return await axiosUpload.post('/api/student/import-student-for-class', data).then(res => {
        if (sucessCallBack) {
          sucessCallBack(res.data)
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

  getListByClassCode: async (classCode: string) => {
    const res = await axiosClient.get(`/api/student/view-list-student-of-CVHT/${classCode}`)

    return res.data
  },

  updateStudent: async (
    studentId: string,
    data: any,
    successCallback?: (res: any) => void,
    errorCallback?: (res: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/student/update-student-for-CVHT/${studentId}`, data).then(res => {
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

export default classStudentService
