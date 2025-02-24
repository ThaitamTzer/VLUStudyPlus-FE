import { create } from 'zustand'

import type { ImportedResult, MissingInforType } from '@/types/management/classStudentType'

type States = {
  openImportStudent: boolean

  classCode: string
  openImportResult: boolean
  importResult: ImportedResult[]
  updateResult: ImportedResult[]
  missingInfoRows: MissingInforType[]
  duplicateRows: MissingInforType[]
}

type Actions = {
  toogleImportStudent: () => void

  setClassCode: (classCode: string) => void
  toogleImportResult: () => void
  setImportResult: (data: ImportedResult[]) => void
  setUpdateResult: (data: ImportedResult[]) => void
  setMissingInfoRows: (data: MissingInforType[]) => void
  setDuplicateRows: (data: MissingInforType[]) => void
}

export const useClassStudentStore = create<States & Actions>(set => ({
  openImportStudent: false,

  classCode: '',
  openImportResult: false,
  importResult: [],
  updateResult: [],
  missingInfoRows: [],
  duplicateRows: [],

  toogleImportStudent: () => set(state => ({ openImportStudent: !state.openImportStudent })),
  toogleImportResult: () => set(state => ({ openImportResult: !state.openImportResult })),

  setClassCode: classCode => set({ classCode }),
  setImportResult: data => set({ importResult: data }),
  setUpdateResult: data => set({ updateResult: data }),
  setMissingInfoRows: data => set({ missingInfoRows: data }),
  setDuplicateRows: data => set({ duplicateRows: data })
}))
