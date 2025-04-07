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
  openAddModal: boolean
  openProgress: boolean
  isCompleted: boolean
  isProcessing: boolean
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
  setOpenAddModal: (open: boolean) => void
  toogleProgress: () => void
  setIsCompleted: (isCompleted: boolean) => void
  setIsProcessing: (isProcessing: boolean) => void
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
  openAddModal: false,
  openProgress: false,
  isCompleted: false,
  isProcessing: false,
  setIsCompleted: isCompleted => set({ isCompleted }),
  setIsProcessing: isProcessing => set({ isProcessing }),
  toogleUpdateStudent: student => set(state => ({ openUpdateStudent: !state.openUpdateStudent, student })),
  toogleImportStudent: () => set(state => ({ openImportStudent: !state.openImportStudent })),
  toogleImportResult: () => set(state => ({ openImportResult: !state.openImportResult })),
  toogletImportAdd: () => set(state => ({ openImportAdd: !state.openImportAdd })),
  setClassCode: classCode => set({ classCode }),
  setImportResult: data => set({ importResult: data }),
  setUpdateResult: data => set({ updateResult: data }),
  setMissingInfoRows: data => set({ missingInfoRows: data }),
  setDuplicateRows: data => set({ duplicateRows: data }),
  setOpenAddModal: open => set({ openAddModal: open }),
  toogleProgress: () => set(state => ({ openProgress: !state.openProgress }))
}))

interface UploadState {
  progress: number
  loading: boolean
  startProgress: () => void
  setProgress: (value: number) => void
  finishProgress: () => void
  resetProgress: () => void
}

export const useUploadStore = create<UploadState>(set => ({
  progress: 0,
  loading: false,

  startProgress: () => set({ progress: 10, loading: true }),

  setProgress: value => set({ progress: value }),

  finishProgress: () => set({ progress: 100, loading: false }),

  resetProgress: () => set({ progress: 0, loading: false })
}))
