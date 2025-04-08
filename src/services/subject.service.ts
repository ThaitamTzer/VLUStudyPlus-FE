import axiosClient from '@/libs/axios'
import type { SubjectTypeList } from '@/types/management/subjectType'

const subjectServices = {
  getAllSubject: async (
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

    const res = await axiosClient.get('/api/subject/view-list-subject', { params })

    return res.data as SubjectTypeList
  }
}

export default subjectServices
