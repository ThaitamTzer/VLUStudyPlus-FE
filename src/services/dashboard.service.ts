import axiosClient from '@/libs/axios'

type StudentCountByCohortType = {
  cohortId: string
  studentCount: number
}

type OnTimeGraduatedStudentCountByCohortType = {
  cohortId: string
  onTimeGraduatedCount: number
}

const dashboardService = {
  studentCountByCohort: async () => {
    const response = await axiosClient.get('/api/dashboard/student-count-by-cohort')

    return response.data as StudentCountByCohortType[]
  },

  lectureCount: async () => {
    const response = await axiosClient.get('/api/dashboard/lecturer-count')

    return response.data
  },

  studentCount: async () => {
    const response = await axiosClient.get('/api/dashboard/student-count')

    return response.data
  },

  classCount: async () => {
    const response = await axiosClient.get('/api/dashboard/class-count')

    return response.data
  },

  academicProcessingCount: async () => {
    const response = await axiosClient.get('/api/dashboard/academic-processing-count')

    return response.data
  },

  academicProcessingStatusDht: async () => {
    const response = await axiosClient.get('/api/dashboard/academic-processing-status-dht')

    return response.data
  },

  academicProcessingStatusCht: async () => {
    const response = await axiosClient.get('/api/dashboard/academic-processing-status-cht')

    return response.data
  },

  gradeCount: async () => {
    const response = await axiosClient.get('/api/dashboard/grade-count')

    return response.data
  },

  onTimeGraduatedStudentCount: async () => {
    const response = await axiosClient.get('/api/dashboard/on-time-graduated-student-count')

    return response.data
  },

  onTimeGraduatedStudentCountByCohort: async () => {
    const response = await axiosClient.get('/api/dashboard/on-time-graduated-student-count-by-cohort')

    return response.data as OnTimeGraduatedStudentCountByCohortType[]
  }
}

export default dashboardService
