import { create } from 'zustand'

import type { ClassStudentType, ImportedResult, MissingInforType } from '@/types/management/classStudentType'

type States = {
  openImportStudent: boolean
  student: ClassStudentType

  openImportAdd: boolean
  openUpdateStudent: boolean

  classCode: string
  openImportResult: boolean
  importResult: ImportedResult[]
  updateResult: ImportedResult[]
  missingInfoRows: MissingInforType[]
  duplicateRows: MissingInforType[]
}

type Actions = {
  toogleImportStudent: () => void

  toogletImportAdd: () => void
  toogleUpdateStudent: (student: ClassStudentType) => void

  setClassCode: (classCode: string) => void
  toogleImportResult: () => void
  setImportResult: (data: ImportedResult[]) => void
  setUpdateResult: (data: ImportedResult[]) => void
  setMissingInfoRows: (data: MissingInforType[]) => void
  setDuplicateRows: (data: MissingInforType[]) => void
}

export const useClassStudentStore = create<States & Actions>(set => ({
  openImportStudent: false,

  openImportAdd: false,
  student: {} as ClassStudentType,

  classCode: '',
  openImportResult: false,
  importResult: [],
  updateResult: [],
  missingInfoRows: [],
  duplicateRows: [],
  openUpdateStudent: false,

  toogleUpdateStudent: student => set(state => ({ openUpdateStudent: !state.openUpdateStudent, student })),

  toogleImportStudent: () => set(state => ({ openImportStudent: !state.openImportStudent })),
  toogleImportResult: () => set(state => ({ openImportResult: !state.openImportResult })),

  toogletImportAdd: () => set(state => ({ openImportAdd: !state.openImportAdd })),

  setClassCode: classCode => set({ classCode }),
  setImportResult: data => set({ importResult: data }),
  setUpdateResult: data => set({ updateResult: data }),
  setMissingInfoRows: data => set({ missingInfoRows: data }),
  setDuplicateRows: data => set({ duplicateRows: data })
}))
