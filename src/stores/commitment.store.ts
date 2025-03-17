import { create } from 'zustand'

import type { LearnProcessType } from '@/types/management/learnProcessType'
import type { CommitmentFormType } from '@/types/management/comimentFormType'

type States = {
  openViewCommitmentByCategory: boolean
  openViewCommimentByCategoryOfCVHT: boolean
  openUpdateStatus: boolean
  cateId: string
  acedemicProcessCommitment: LearnProcessType | null
  acedemicProcessCommitmentOfCVHT: LearnProcessType | null
  commitmentForms: CommitmentFormType
  openViewDetailCommitmentForm: boolean
  openApproveCommitment: boolean
  openRejectCommitment: boolean
}

type Actions = {
  toogleViewCommnitmentByCategory: () => void
  toogleViewCommnitmentByCategoryOfCVHT: () => void
  toogleUpdateStatus: () => void
  setCateId: (cateId: string) => void
  setAcedemicProcessCommiment: (acedemicProcessCommitment: LearnProcessType | null) => void
  setAcedemicProcessCommimentOfCVHT: (acedemicProcessCommitmentOfCVHT: LearnProcessType | null) => void
  toogleViewDetailCommitmentForm: () => void
  setCommitmentForms: (commitmentForms: CommitmentFormType) => void
  toogleOpenApproveCommitment: () => void
  toogleOpenRejectCommitment: () => void
}

export const useCommitmentStore = create<States & Actions>(set => ({
  openViewCommitmentByCategory: false,
  openUpdateStatus: false,
  cateId: '',
  acedemicProcessCommitment: null,
  commitmentForms: {} as CommitmentFormType,
  openViewDetailCommitmentForm: false,
  openViewCommimentByCategoryOfCVHT: false,
  openApproveCommitment: false,
  toogleOpenApproveCommitment: () => set(state => ({ openApproveCommitment: !state.openApproveCommitment })),
  openRejectCommitment: false,
  toogleOpenRejectCommitment: () => set(state => ({ openRejectCommitment: !state.openRejectCommitment })),
  toogleViewCommnitmentByCategoryOfCVHT: () =>
    set(state => ({ openViewCommimentByCategoryOfCVHT: !state.openViewCommimentByCategoryOfCVHT })),
  setCommitmentForms: commitmentForms => set({ commitmentForms }),
  toogleViewDetailCommitmentForm: () =>
    set(state => ({ openViewDetailCommitmentForm: !state.openViewDetailCommitmentForm })),
  setAcedemicProcessCommiment: acedemicProcessCommitment => set({ acedemicProcessCommitment }),
  acedemicProcessCommitmentOfCVHT: null,
  setAcedemicProcessCommimentOfCVHT: acedemicProcessCommitmentOfCVHT => set({ acedemicProcessCommitmentOfCVHT }),
  setCateId: cateId => set({ cateId }),
  toogleViewCommnitmentByCategory: () =>
    set(state => ({ openViewCommitmentByCategory: !state.openViewCommitmentByCategory })),
  toogleUpdateStatus: () => set(state => ({ openUpdateStatus: !state.openUpdateStatus }))
}))
