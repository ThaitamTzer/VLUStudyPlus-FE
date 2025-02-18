import { create } from 'zustand'

import type { ErrorImport, Student, StudentResult } from '@/types/management/studentType'

type State = {
  students: Student[]
  student: Student | null
  total: number
  openAddStudent: boolean
  openUpdateStudent: boolean
  openBlockStudent: boolean
  openUnBlockStudent: boolean
  openUpdateAvatar: boolean
  openViewDetail: boolean
  openViewAvatar: boolean

  openImportResult: boolean
  studentsResult: StudentResult[]
  updatedStudents: StudentResult[]
  missingInfoRows: ErrorImport[]
  duplicateRows: ErrorImport[]
}

type Action = {
  setStudents: (students: Student[]) => void
  setStudent: (student: Student) => void
  setTotal: (total: number) => void
  toogleAddStudent: () => void
  toogleUpdateStudent: () => void
  toogleBlockStudent: () => void
  toogleUnBlockStudent: () => void
  toogleUpdateAvatar: () => void
  toogleViewDetail: () => void
  toogleViewAvatar: () => void

  toogleImportResult: () => void
  setStudentsResult: (students: StudentResult[]) => void
  setUpdatedStudents: (students: StudentResult[]) => void
  setMissingInfoRows: (students: ErrorImport[]) => void
  setDuplicateRows: (students: ErrorImport[]) => void
}

export const useStudentStore = create<State & Action>(set => ({
  students: [],
  student: null,
  total: 0,
  openAddStudent: false,
  openUpdateStudent: false,
  openBlockStudent: false,
  openUnBlockStudent: false,
  openUpdateAvatar: false,
  openViewDetail: false,
  openViewAvatar: false,

  openImportResult: false,
  studentsResult: [],
  updatedStudents: [],
  missingInfoRows: [],
  duplicateRows: [],

  setStudents: students => set({ students }),
  setStudent: student => set({ student }),
  setTotal: total => set({ total }),
  toogleAddStudent: () => set(state => ({ openAddStudent: !state.openAddStudent })),
  toogleUpdateStudent: () => set(state => ({ openUpdateStudent: !state.openUpdateStudent })),
  toogleBlockStudent: () => set(state => ({ openBlockStudent: !state.openBlockStudent })),
  toogleUnBlockStudent: () => set(state => ({ openUnBlockStudent: !state.openUnBlockStudent })),
  toogleUpdateAvatar: () => set(state => ({ openUpdateAvatar: !state.openUpdateAvatar })),
  toogleViewDetail: () => set(state => ({ openViewDetail: !state.openViewDetail })),
  toogleViewAvatar: () => set(state => ({ openViewAvatar: !state.openViewAvatar })),

  toogleImportResult: () => set(state => ({ openImportResult: !state.openImportResult })),
  setStudentsResult: students => set({ studentsResult: students }),
  setUpdatedStudents: students => set({ updatedStudents: students }),
  setMissingInfoRows: students => set({ missingInfoRows: students }),
  setDuplicateRows: students => set({ duplicateRows: students })
}))
