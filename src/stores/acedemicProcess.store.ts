import { create } from 'zustand'

import type { LearnProcessType } from '@/types/management/learnProcessType'

type States = {
  openAddAcedemicProcess: boolean
  openUpdateAcedemicProcess: boolean
  openDeleteAcedemicProcess: boolean
  acedemicProcess: LearnProcessType | null
}

type Actions = {
  toogleAddAcedemicProcess: () => void
  toogleUpdateAcedemicProcess: () => void
  toogleDeleteAcedemicProcess: () => void
  setAcedemicProcess: (acedemicProcess: LearnProcessType) => void
}

export const useAcedemicProcessStore = create<States & Actions>(set => ({
  openAddAcedemicProcess: false,
  openUpdateAcedemicProcess: false,
  openDeleteAcedemicProcess: false,
  acedemicProcess: null,
  setAcedemicProcess: acedemicProcess => set({ acedemicProcess }),
  toogleAddAcedemicProcess: () => set(state => ({ openAddAcedemicProcess: !state.openAddAcedemicProcess })),
  toogleUpdateAcedemicProcess: () => set(state => ({ openUpdateAcedemicProcess: !state.openUpdateAcedemicProcess })),
  toogleDeleteAcedemicProcess: () => set(state => ({ openDeleteAcedemicProcess: !state.openDeleteAcedemicProcess }))
}))
