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
  setInserted: inserted => set({ inserted }),
  setMissingInfoRows: missingInfoRows => set({ missingInfoRows }),
  setDuplicateRows: duplicateRows => set({ duplicateRows }),
  setAcedemicProcess: acedemicProcess => set({ acedemicProcess }),
  toogleAddAcedemicProcess: () => set(state => ({ openAddAcedemicProcess: !state.openAddAcedemicProcess })),
  toogleUpdateAcedemicProcess: () => set(state => ({ openUpdateAcedemicProcess: !state.openUpdateAcedemicProcess })),
  toogleDeleteAcedemicProcess: () => set(state => ({ openDeleteAcedemicProcess: !state.openDeleteAcedemicProcess })),
  toogleImportModal: () => set(state => ({ openImportModal: !state.openImportModal })),
  toogleImportResultModal: () => set(state => ({ openImportResultModal: !state.openImportResultModal })),
  toogleManualAdd: () => set(state => ({ openManualAdd: !state.openManualAdd }))
}))
