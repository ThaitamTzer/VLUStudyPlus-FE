import { create } from 'zustand'

import type { TypeProcessType } from '@/types/management/typeProcessType'

type States = {
  typeProcess: TypeProcessType | null
  openAddTypeProcess: boolean
  openUpdateTypeProcess: boolean
  openDeleteTypeProcess: boolean
}

type Actions = {
  setTypeProcess: (typeProcess: TypeProcessType) => void
  toogleAddTypeProcess: () => void
  toogleUpdateTypeProcess: () => void
  toogleDeleteTypeProcess: () => void
}

export const useTypeProcessStore = create<States & Actions>(set => ({
  typeProcess: null,
  setTypeProcess: typeProcess => set({ typeProcess }),
  openAddTypeProcess: false,
  openUpdateTypeProcess: false,
  openDeleteTypeProcess: false,
  toogleAddTypeProcess: () => set(state => ({ openAddTypeProcess: !state.openAddTypeProcess })),
  toogleUpdateTypeProcess: () => set(state => ({ openUpdateTypeProcess: !state.openUpdateTypeProcess })),
  toogleDeleteTypeProcess: () => set(state => ({ openDeleteTypeProcess: !state.openDeleteTypeProcess }))
}))
