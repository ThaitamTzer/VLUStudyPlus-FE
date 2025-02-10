import axiosClient from '@/libs/axios'

const lecturerService = {
  geAll: async (page?: number, limit?: number, filterField?: string, filterValue?: string, searchKey?: string) => {
    const params = {
      ...(page && { page: page }),
      ...(limit && { limit: limit }),
      ...(filterField && { filterField: filterField }),
      ...(filterValue && { filterValue: filterValue }),
      ...(searchKey && { searchKey: searchKey })
    }

    const response = await axiosClient.get('/lecturers', { params })

    return response.data
  }
}

export default lecturerService
