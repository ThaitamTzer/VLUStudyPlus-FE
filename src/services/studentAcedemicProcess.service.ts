import axiosClient from '@/libs/axios'
import type { ProcessingType } from '@/types/management/learnProcessType'

const studentAcedemicProcessService = {
  getStudentAcedemicProcess: async () => {
    const response = await axiosClient.get(`/api/academic-processing/view-list-academicProcessing-of-student`)

    return response.data as ProcessingType[]
  }
}

export default studentAcedemicProcessService
