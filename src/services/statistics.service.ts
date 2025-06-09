import axiosClient from '@/libs/axios'
import type { StatisticsProcessByTerm } from '@/types/statisticsType'

const statisticsService = {
  getStatistics: async (startYear?: string, endYear?: string, term?: string, customParams?: Record<string, any>) => {
    const params = {
      ...(startYear && { startYear }),
      ...(endYear && { endYear }),
      ...(term && { term }),
      ...customParams // thêm các tham số tùy biến vào đây
    }

    const res = await axiosClient.get('/api/statistics/get-statistic-by-term', { params })

    return res.data as StatisticsProcessByTerm
  },

  getStatisticsByprocessOfCVHT: async (
    startYear?: string,
    endYear?: string,
    term?: string,
    customParams?: Record<string, any>
  ) => {
    const params = {
      ...(startYear && { startYear }),
      ...(endYear && { endYear }),
      ...(term && { term }),
      ...customParams // thêm các tham số tùy biến vào đây
    }

    const res = await axiosClient.get('/api/statistics/get-statistic-by-term?processOfCVHT=true', { params })

    return res.data
  },

  getStatisticsByStatus: async (
    startYear?: string,
    endYear?: string,
    term?: string,
    customParams?: Record<string, any>
  ) => {
    const params = {
      ...(startYear && { startYear }),
      ...(endYear && { endYear }),
      ...(term && { term }),
      ...customParams // thêm các tham số tùy biến vào đây
    }

    const res = await axiosClient.get('/api/statistics/get-statistic-by-term?status=true', { params })

    return res.data
  },

  getStatisticsByClass: async (startYear?: string, endYear?: string, term?: string, classIds?: string[]) => {
    const params = {
      ...(startYear && { startYear }),
      ...(endYear && { endYear }),
      ...(term && { term })
    }

    // Tạo query string với multiple classId params
    const queryParams = new URLSearchParams()

    // Thêm các tham số khác
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value)
      }
    })

    // Thêm multiple classId params
    if (classIds && classIds.length > 0) {
      classIds.forEach(classId => {
        queryParams.append('classId', classId)
      })
    }

    const res = await axiosClient.get(`/api/statistics/get-statistic-by-term?${queryParams.toString()}`)

    return res.data
  },

  getStatisticsByStudentKQHT: async (startYear?: string, endYear?: string, term?: string, classIds?: string[]) => {
    const params = {
      ...(startYear && { startYear }),
      ...(endYear && { endYear }),
      ...(term && { term })
    }

    // Tạo query string với multiple classId params
    const queryParams = new URLSearchParams()

    // Thêm các tham số khác
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value)
      }
    })

    // Thêm multiple classId params
    if (classIds && classIds.length > 0) {
      classIds.forEach(classId => {
        queryParams.append('classId', classId)
      })
    }

    const res = await axiosClient.get(`/api/statistics/get-statistic-by-process?${queryParams.toString()}`)

    return res.data
  },

  getStatisticsByStudentTTHK: async (classIds?: string[], cohortId?: string[]) => {
    // Tạo query string với multiple classId params
    const queryParams = new URLSearchParams()

    // Thêm multiple classId params
    if (classIds && classIds.length > 0) {
      classIds.forEach(classId => {
        queryParams.append('classId', classId)
      })
    }

    // Thêm multiple cohortId params
    if (cohortId && cohortId.length > 0) {
      cohortId.forEach(cohortId => {
        queryParams.append('cohortId', cohortId)
      })
    }

    const res = await axiosClient.get(`/api/statistics/get-statistic-by-progress-of-student?${queryParams.toString()}`)

    return res.data
  }
}

export default statisticsService
