import { create } from 'zustand'

import type { Inserted, LearnProcessType, MissingInfoRows } from '@/types/management/learnProcessType'

type States = {
  openAddAcedemicProcess: boolean
  openUpdateAcedemicProcess: boolean
  openDeleteAcedemicProcess: boolean
  acedemicProcess: LearnProcessType | null
  openImportModal: boolean
  openImportResultModal: boolean
  inserted: Inserted[]
  missingInfoRows: MissingInfoRows[]
  duplicateRows: MissingInfoRows[]
  openManualAdd: boolean
  openViewByCategory: boolean
  openViewDetail: boolean
  openManualAddFromViewByCate: boolean
  openProgress: boolean
}

type Actions = {
  toogleAddAcedemicProcess: () => void
  toogleUpdateAcedemicProcess: () => void
  toogleDeleteAcedemicProcess: () => void
  setAcedemicProcess: (acedemicProcess: LearnProcessType) => void
  toogleImportModal: () => void
  toogleImportResultModal: () => void
  setInserted: (inserted: Inserted[]) => void
  setMissingInfoRows: (missingInfoRows: MissingInfoRows[]) => void
  setDuplicateRows: (duplicateRows: MissingInfoRows[]) => void
  toogleManualAdd: () => void
  toogleViewByCategory: () => void
  toogleViewDetail: () => void
  toogleManualAddFromViewByCate: () => void
  toogleProgress: () => void
}

export const useAcedemicProcessStore = create<States & Actions>(set => ({
  openAddAcedemicProcess: false,
  openUpdateAcedemicProcess: false,
  openDeleteAcedemicProcess: false,
  acedemicProcess: null,
  openImportModal: false,
  openImportResultModal: false,
  inserted: [],
  missingInfoRows: [],
  duplicateRows: [],
  openManualAdd: false,
  openViewByCategory: false,
  openViewDetail: false,
  openManualAddFromViewByCate: false,
  openProgress: false,
  setInserted: inserted => set({ inserted }),
  setMissingInfoRows: missingInfoRows => set({ missingInfoRows }),
  setDuplicateRows: duplicateRows => set({ duplicateRows }),
  setAcedemicProcess: acedemicProcess => set({ acedemicProcess }),
  toogleAddAcedemicProcess: () => set(state => ({ openAddAcedemicProcess: !state.openAddAcedemicProcess })),
  toogleUpdateAcedemicProcess: () => set(state => ({ openUpdateAcedemicProcess: !state.openUpdateAcedemicProcess })),
  toogleDeleteAcedemicProcess: () => set(state => ({ openDeleteAcedemicProcess: !state.openDeleteAcedemicProcess })),
  toogleImportModal: () => set(state => ({ openImportModal: !state.openImportModal })),
  toogleImportResultModal: () => set(state => ({ openImportResultModal: !state.openImportResultModal })),
  toogleManualAdd: () => set(state => ({ openManualAdd: !state.openManualAdd })),

  toogleViewByCategory: () => set(state => ({ openViewByCategory: !state.openViewByCategory })),
  toogleViewDetail: () => set(state => ({ openViewDetail: !state.openViewDetail })),
  toogleManualAddFromViewByCate: () =>
    set(state => ({ openManualAddFromViewByCate: !state.openManualAddFromViewByCate })),
  toogleProgress: () => set(state => ({ openProgress: !state.openProgress }))
}))
