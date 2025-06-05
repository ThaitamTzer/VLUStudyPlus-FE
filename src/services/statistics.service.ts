import axiosClient from '@/libs/axios'

const statisticsService = {
  getStatistics: async (startYear?: string, endYear?: string, term?: string, customParams?: Record<string, any>) => {
    const params = {
      ...(startYear && { startYear }),
      ...(endYear && { endYear }),
      ...(term && { term }),
      ...customParams // thêm các tham số tùy biến vào đây
    }

    const res = await axiosClient.get('/api/statistics/get-statistic-by-term', { params })

    return res.data
  }
}

export default statisticsService
