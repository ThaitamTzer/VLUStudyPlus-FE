import axiosClient from '@/libs/axios'
import type { GradeTypeByClassCode, GradeTypeById } from '@/types/management/gradeTypes'

const gradeService = {
  getGradeByClassCode: async (
    classId: string,
    filterField?: string,
    filterValue?: string,
    sortField?: string,
    sortOrder?: string
  ) => {
    const params = {
      ...(filterField && { filterField: filterField }),
      ...(filterValue && { filterValue: filterValue }),
      ...(sortField && { sortField: sortField }),
      ...(sortOrder && { sortOrder: sortOrder })
    }

    const response = await axiosClient.get(`/api/grade/view-grade-GV/${classId}`, { params })

    return response.data as GradeTypeByClassCode
  },

  getGradeById: async (id: string) => {
    const response = await axiosClient.get(`/api/grade/view-grade-GV-detail/${id}`)

    return response.data as GradeTypeById
  },

  importGrades: async (
    studentId: string,
    data: any,
    successCallback?: (res: any) => void,
    errorCallback?: (err: any) => void
  ) => {
    try {
      return await axiosClient.post(`/api/grade/import-grade-by-CVHT/${studentId}`, data).then(res => {
        if (successCallback) {
          successCallback(res.data)
        }

        return res.data
      })
    } catch (error) {
      if (errorCallback) {
        errorCallback(error)
      }

      return Promise.reject(error)
    }
  },

  updateGrade: async (
    gradeId: string,
    id: string,
    data: any,
    successCallback?: (res: any) => void,
    errorCallback?: (err: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/grade/update-grade-CVHT/${gradeId}/${id}`, data).then(res => {
        if (successCallback) {
          successCallback(res.data)
        }

        return res.data
      })
    } catch (error) {
      if (errorCallback) {
        errorCallback(error)
      }

      return Promise.reject(error)
    }
  },

  getGradeStudent: async () => {
    const response = await axiosClient.get(`api/grade/view-grade-SV`)

    return response.data as GradeTypeById
  },

  importGradeStudent: async (data: any, successCallback?: (res: any) => void, errorCallback?: (err: any) => void) => {
    try {
      return await axiosClient.post(`/api/grade/import-grade`, data).then(res => {
        if (successCallback) {
          successCallback(res.data)
        }

        return res.data
      })
    } catch (error) {
      if (errorCallback) {
        errorCallback(error)
      }

      return Promise.reject(error)
    }
  },

  updateGradeStudent: async (
    id: string,
    data: any,
    successCallback?: (res: any) => void,
    errorCallback?: (err: any) => void
  ) => {
    try {
      return await axiosClient.put(`/api/grade/update-grade/${id}`, data).then(res => {
        if (successCallback) {
          successCallback(res.data)
        }

        return res.data
      })
    } catch (error) {
      if (errorCallback) {
        errorCallback(error)
      }

      return Promise.reject(error)
    }
  }
}

export default gradeService
