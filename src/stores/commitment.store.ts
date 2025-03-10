import { create } from 'zustand'

import type { LearnProcessType } from '@/types/management/learnProcessType'
import type { CommitmentFormType } from '@/types/management/comimentFormType'

type States = {
  openViewByCategory: boolean
  openViewByCategoryOfCVHT: boolean
  openUpdateStatus: boolean
  cateId: string
  acedemicProcess: LearnProcessType | null
  commitmentForms: CommitmentFormType
  openViewDetailCommitmentForm: boolean
}

type Actions = {
  toogleViewByCategory: () => void
  toogleViewByCategoryOfCVHT: () => void
  toogleUpdateStatus: () => void
  setCateId: (cateId: string) => void
  setAcedemicProcess: (acedemicProcess: LearnProcessType | null) => void
  toogleViewDetailCommitmentForm: () => void
  setCommitmentForms: (commitmentForms: CommitmentFormType) => void
}

export const useCommitmentStore = create<States & Actions>(set => ({
  openViewByCategory: false,
  openUpdateStatus: false,
  cateId: '',
  acedemicProcess: null,
  commitmentForms: {} as CommitmentFormType,
  openViewDetailCommitmentForm: false,
  openViewByCategoryOfCVHT: false,
  toogleViewByCategoryOfCVHT: () => set(state => ({ openViewByCategoryOfCVHT: !state.openViewByCategoryOfCVHT })),
  setCommitmentForms: commitmentForms => set({ commitmentForms }),
  toogleViewDetailCommitmentForm: () =>
    set(state => ({ openViewDetailCommitmentForm: !state.openViewDetailCommitmentForm })),
  setAcedemicProcess: acedemicProcess => set({ acedemicProcess }),
  setCateId: cateId => set({ cateId }),
  toogleViewByCategory: () => set(state => ({ openViewByCategory: !state.openViewByCategory })),
  toogleUpdateStatus: () => set(state => ({ openUpdateStatus: !state.openUpdateStatus }))
}))
