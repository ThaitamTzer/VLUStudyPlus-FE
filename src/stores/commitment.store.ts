import { create } from 'zustand'

import type { LearnProcessType } from '@/types/management/learnProcessType'

type States = {
  openViewByCategory: boolean
  openUpdateStatus: boolean
  cateId: string
  acedemicProcess: LearnProcessType | null
}

type Actions = {
  toogleViewByCategory: () => void
  toogleUpdateStatus: () => void
  setCateId: (cateId: string) => void
  setAcedemicProcess: (acedemicProcess: LearnProcessType | null) => void
}

export const useCommitmentStore = create<States & Actions>(set => ({
  openViewByCategory: false,
  openUpdateStatus: false,
  cateId: '',
  acedemicProcess: null,
  setAcedemicProcess: acedemicProcess => set({ acedemicProcess }),
  setCateId: cateId => set({ cateId }),
  toogleViewByCategory: () => set(state => ({ openViewByCategory: !state.openViewByCategory })),
  toogleUpdateStatus: () => set(state => ({ openUpdateStatus: !state.openUpdateStatus }))
}))
