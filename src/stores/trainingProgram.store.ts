import { create } from 'zustand'

import type { TrainingProgramType } from '@/types/management/trainningProgramType'

type States = {
  openCreateTrainingProgram: boolean
  openUpdateTrainingProgram: boolean
  openDeleteTrainingProgram: boolean
  openImportTrainingProgramSession: boolean
  trainingProgram: TrainingProgramType | null
  openImportProgramLoading: boolean
  openViewTrainingProgramByFrame: boolean
  isProgress: boolean
  isComplete: boolean
  openCreateCategory1: boolean
  openEditCategory1: boolean
  programid: string | null
  openAddSubjectInFrame: boolean
  openAddSubjectInCate: boolean
  openAddSubjectModal: boolean
  selectedProgramId: string
}

type Actions = {
  toogleCreateTrainingProgram: () => void
  toogleUpdateTrainingProgram: () => void
  toogleDeleteTrainingProgram: () => void
  toogleImportTrainingProgramSession: () => void
  setTrainingProgram: (trainingProgram: TrainingProgramType | null) => void
  toogleImportProgramLoading: () => void
  toogleViewTrainingProgramByFrame: () => void
  setIsProgress: (isProgress: boolean) => void
  setIsComplete: (isComplete: boolean) => void
  toogleCreateCategory1: () => void
  toogleUpdateCategory1: () => void
  setProgramId: (programid: string) => void
  toogleOpenAddSubjectInFrame: () => void
  toogleOpenAddSubjectInCate: () => void
  toogleAddSubjectModal: () => void
  setSelectedProgramId: (id: string) => void
}

export const useTrainingProgramStore = create<States & Actions>(set => ({
  openCreateTrainingProgram: false,
  openUpdateTrainingProgram: false,
  openDeleteTrainingProgram: false,
  openImportTrainingProgramSession: false,
  trainingProgram: null,
  openImportProgramLoading: false,
  openViewTrainingProgramByFrame: false,
  isProgress: false,
  isComplete: false,
  openCreateCategory1: false,
  openEditCategory1: false,
  programid: null,
  openAddSubjectInCate: false,
  openAddSubjectInFrame: false,
  openAddSubjectModal: false,
  selectedProgramId: '',
  toogleOpenAddSubjectInCate: () => set(state => ({ openAddSubjectInCate: !state.openAddSubjectInCate })),
  toogleOpenAddSubjectInFrame: () => set(state => ({ openAddSubjectInFrame: !state.openAddSubjectInFrame })),
  setProgramId: (programid: string | null) => set({ programid }),
  toogleUpdateCategory1: () => set(state => ({ openEditCategory1: !state.openEditCategory1 })),
  toogleCreateCategory1: () => set(state => ({ openCreateCategory1: !state.openCreateCategory1 })),
  setIsProgress: (isProgress: boolean) => set({ isProgress }),
  setIsComplete: (isComplete: boolean) => set({ isComplete }),
  toogleViewTrainingProgramByFrame: () =>
    set(state => ({ openViewTrainingProgramByFrame: !state.openViewTrainingProgramByFrame })),
  toogleImportProgramLoading: () => set(state => ({ openImportProgramLoading: !state.openImportProgramLoading })),
  toogleCreateTrainingProgram: () => set(state => ({ openCreateTrainingProgram: !state.openCreateTrainingProgram })),
  toogleUpdateTrainingProgram: () => set(state => ({ openUpdateTrainingProgram: !state.openUpdateTrainingProgram })),
  toogleDeleteTrainingProgram: () => set(state => ({ openDeleteTrainingProgram: !state.openDeleteTrainingProgram })),
  toogleImportTrainingProgramSession: () =>
    set(state => ({ openImportTrainingProgramSession: !state.openImportTrainingProgramSession })),
  setTrainingProgram: (trainingProgram: TrainingProgramType | null) => set({ trainingProgram }),
  toogleAddSubjectModal: () => set(state => ({ openAddSubjectModal: !state.openAddSubjectModal })),
  setSelectedProgramId: (id: string) => set({ selectedProgramId: id })
}))
