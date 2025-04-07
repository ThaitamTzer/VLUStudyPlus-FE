import { create } from 'zustand'

import type { Inserted, LearnProcessType, MissingInfoRows, ProcessingType } from '@/types/management/learnProcessType'

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
  openEditViewAcedemicProcess: boolean
  processing: ProcessingType | null
  listAcedemicProcess: LearnProcessType[]
  openDeleteViewAcedemicProcess: boolean
  openViewDetailAcademicProcess: boolean
  openUpdateAcedemicProcessStatus: boolean
  openSendEmail: boolean
  openSendEmailRemind: boolean
  isProcessing: boolean
  isCompleted: boolean
  session: LearnProcessType | null
}

type Actions = {
  toogleAddAcedemicProcess: () => void
  toogleUpdateAcedemicProcess: () => void
  toogleDeleteAcedemicProcess: () => void
  setAcedemicProcess: (acedemicProcess: LearnProcessType | null) => void
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
  toogleEditViewAcedemicProcess: () => void
  setProcessing: (processing: ProcessingType | null) => void
  setListAcedemicProcess: (listAcedemicProcess: LearnProcessType[]) => void
  toogleDeleteViewAcedemicProcess: () => void
  toogleViewDetailAcademicProcess: () => void
  toogleUpdateAcedemicProcessStatus: () => void
  tooogleSendEmail: () => void
  toogleSendEmailRemind: () => void
  setIsProcessing: (isProcessing: boolean) => void
  setIsCompleted: (isCompleted: boolean) => void
  setSession: (session: LearnProcessType | null) => void
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
  openEditViewAcedemicProcess: false,
  processing: null,
  listAcedemicProcess: [],
  openDeleteViewAcedemicProcess: false,
  openViewDetailAcademicProcess: false,
  openUpdateAcedemicProcessStatus: false,
  openSendEmail: false,
  openSendEmailRemind: false,
  isProcessing: false,
  isCompleted: false,
  session: null,
  setSession: session => set({ session }),
  setIsProcessing: isProcessing => set({ isProcessing }),
  setIsCompleted: isCompleted => set({ isCompleted }),
  toogleSendEmailRemind: () => set(state => ({ openSendEmailRemind: !state.openSendEmailRemind })),
  tooogleSendEmail: () => set(state => ({ openSendEmail: !state.openSendEmail })),
  toogleUpdateAcedemicProcessStatus: () =>
    set(state => ({ openUpdateAcedemicProcessStatus: !state.openUpdateAcedemicProcessStatus })),
  toogleViewDetailAcademicProcess: () =>
    set(state => ({ openViewDetailAcademicProcess: !state.openViewDetailAcademicProcess })),
  setListAcedemicProcess: listAcedemicProcess => set({ listAcedemicProcess }),
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
  toogleProgress: () => set(state => ({ openProgress: !state.openProgress })),
  toogleEditViewAcedemicProcess: () =>
    set(state => ({ openEditViewAcedemicProcess: !state.openEditViewAcedemicProcess })),
  setProcessing: processing => set({ processing }),
  toogleDeleteViewAcedemicProcess: () =>
    set(state => ({ openDeleteViewAcedemicProcess: !state.openDeleteViewAcedemicProcess }))
}))
