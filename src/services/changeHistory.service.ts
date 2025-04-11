import axiosClient from '@/libs/axios'
import type { ChangeHistory } from '@/types/management/changeHistoryType'

const changeHistoryService = {
  getChangeHistoryById: async (id: string) => {
    const res = await axiosClient.get(`/api/edit-history/get-edit-history/${id}`)

    return res.data as ChangeHistory
  }
}

export default changeHistoryService
