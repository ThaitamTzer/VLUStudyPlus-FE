import axiosClient from '@/libs/axios'
import type { ClassLecturer } from '@/types/management/classLecturerType'

const classLecturerService = {
  getList: async () => {
    const res = await axiosClient.get('/api/class/view-list-class-of-CVHT')

    return res.data as ClassLecturer[]
  }
}

export default classLecturerService
