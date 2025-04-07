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
  setTrainingProgram: (trainingProgram: TrainingProgramType | null) => set({ trainingProgram })
}))
