import { create } from 'zustand'

import type { ProcessingType } from '@/types/management/learnProcessType'
import type { CommitmentForm } from '@/types/management/comimentFormType'

type States = {
  openAddCommitmentForm: boolean
  openDeleteCommitmentForm: boolean
  openUpdateCommitmentForm: boolean
  openViewCommitmentForm: boolean
  idProcess: string
  idCommitment: string
  openStudentViewDetailCommitmentForm: boolean
  processObj: ProcessingType | null
  commitmentFormObj: CommitmentForm | null
  openSignSignatureForm: boolean
}

type Actions = {
  toogleAddCommitmentForm: () => void
  toogleUpdateCommitmentForm: () => void
  toogleViewCommitmentForm: () => void
  setIdProcess: (id: string) => void
  setIdCommitment: (id: string) => void
  toogleStudentViewDetailCommitmentForm: () => void
  setProcessObj: (processObj: ProcessingType | null) => void
  tooogleDeleteCommitmentForm: () => void
  setCommitmentFormObj: (commitmentFormObj: CommitmentForm | null) => void
  toogleSignSignatureForm: () => void
}

export const useStudentAcedemicProcessStore = create<States & Actions>(set => ({
  openAddCommitmentForm: false,
  openUpdateCommitmentForm: false,
  openViewCommitmentForm: false,
  idCommitment: '',
  idProcess: '',
  processObj: null,
  commitmentFormObj: null,
  openSignSignatureForm: false,
  toogleSignSignatureForm: () => set(state => ({ openSignSignatureForm: !state.openSignSignatureForm })),
  setCommitmentFormObj: commitmentFormObj =>
    set({
      commitmentFormObj
    }),
  setProcessObj: processObj =>
    set({
      processObj
    }),
  openStudentViewDetailCommitmentForm: false,
  toogleStudentViewDetailCommitmentForm: () =>
    set(state => ({ openStudentViewDetailCommitmentForm: !state.openStudentViewDetailCommitmentForm })),
  setIdCommitment: id => set({ idCommitment: id }),
  setIdProcess: id => set({ idProcess: id }),
  toogleAddCommitmentForm: () => set(state => ({ openAddCommitmentForm: !state.openAddCommitmentForm })),
  toogleUpdateCommitmentForm: () => set(state => ({ openUpdateCommitmentForm: !state.openUpdateCommitmentForm })),
  toogleViewCommitmentForm: () => set(state => ({ openViewCommitmentForm: !state.openViewCommitmentForm })),
  openDeleteCommitmentForm: false,
  tooogleDeleteCommitmentForm: () => set(state => ({ openDeleteCommitmentForm: !state.openDeleteCommitmentForm }))
}))
