import { create } from 'zustand'

import type { ProcessResultType } from '@/types/management/processResultType'

type State = {
  openAddResultProcess: boolean
  openEditResultProcess: boolean
  openDeleteResultProcess: boolean
  resultProcessData: ProcessResultType | null
}

type Actions = {
  toogleAddResultProcess: () => void
  toolEditResultProcess: () => void
  toogleDeleteResultProcess: () => void
  setResultProcessData: (data: ProcessResultType | null) => void
}

export const useResultProcessStore = create<State & Actions>(set => ({
  openAddResultProcess: false,
  openEditResultProcess: false,
  openDeleteResultProcess: false,
  resultProcessData: null,
  toogleAddResultProcess: () => set(state => ({ openAddResultProcess: !state.openAddResultProcess })),
  toolEditResultProcess: () => set(state => ({ openEditResultProcess: !state.openEditResultProcess })),
  toogleDeleteResultProcess: () => set(state => ({ openDeleteResultProcess: !state.openDeleteResultProcess })),
  setResultProcessData: data => set({ resultProcessData: data })
}))
