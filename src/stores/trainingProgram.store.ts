import { create } from 'zustand'

import type { TrainingProgramType } from '@/types/management/trainningProgramType'

type States = {
  openCreateTrainingProgram: boolean
  openUpdateTrainingProgram: boolean
  openDeleteTrainingProgram: boolean
  openImportTrainingProgramSession: boolean
  trainingProgram: TrainingProgramType | null
}

type Actions = {
  toogleCreateTrainingProgram: () => void
  toogleUpdateTrainingProgram: () => void
  toogleDeleteTrainingProgram: () => void
  toogleImportTrainingProgramSession: () => void
  setTrainingProgram: (trainingProgram: TrainingProgramType) => void
}

export const useTrainingProgramStore = create<States & Actions>(set => ({
  openCreateTrainingProgram: false,
  openUpdateTrainingProgram: false,
  openDeleteTrainingProgram: false,
  openImportTrainingProgramSession: false,
  trainingProgram: null,

  toogleCreateTrainingProgram: () => set(state => ({ openCreateTrainingProgram: !state.openCreateTrainingProgram })),
  toogleUpdateTrainingProgram: () => set(state => ({ openUpdateTrainingProgram: !state.openUpdateTrainingProgram })),
  toogleDeleteTrainingProgram: () => set(state => ({ openDeleteTrainingProgram: !state.openDeleteTrainingProgram })),
  toogleImportTrainingProgramSession: () =>
    set(state => ({ openImportTrainingProgramSession: !state.openImportTrainingProgramSession })),
  setTrainingProgram: (trainingProgram: TrainingProgramType) => set({ trainingProgram })
}))
