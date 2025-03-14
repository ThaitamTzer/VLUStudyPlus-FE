import { create } from 'zustand'

type States = {
  openAddCommitmentForm: boolean
  openUpdateCommitmentForm: boolean
  openViewCommitmentForm: boolean
  idProcess: string
  idCommitment: string
}

type Actions = {
  toogleAddCommitmentForm: () => void
  toogleUpdateCommitmentForm: () => void
  toogleViewCommitmentForm: () => void
  setIdProcess: (id: string) => void
  setIdCommitment: (id: string) => void
}

export const useStudentAcedemicProcessStore = create<States & Actions>(set => ({
  openAddCommitmentForm: false,
  openUpdateCommitmentForm: false,
  openViewCommitmentForm: false,
  idCommitment: '',
  idProcess: '',
  setIdCommitment: id => set({ idCommitment: id }),
  setIdProcess: id => set({ idProcess: id }),
  toogleAddCommitmentForm: () => set(state => ({ openAddCommitmentForm: !state.openAddCommitmentForm })),
  toogleUpdateCommitmentForm: () => set(state => ({ openUpdateCommitmentForm: !state.openUpdateCommitmentForm })),
  toogleViewCommitmentForm: () => set(state => ({ openViewCommitmentForm: !state.openViewCommitmentForm }))
}))
