import { create } from 'zustand'

import type { Student } from '@/types/management/studentType'

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
  setStudents: students => set({ students }),
  setStudent: student => set({ student }),
  setTotal: total => set({ total }),
  toogleAddStudent: () => set(state => ({ openAddStudent: !state.openAddStudent })),
  toogleUpdateStudent: () => set(state => ({ openUpdateStudent: !state.openUpdateStudent })),
  toogleBlockStudent: () => set(state => ({ openBlockStudent: !state.openBlockStudent })),
  toogleUnBlockStudent: () => set(state => ({ openUnBlockStudent: !state.openUnBlockStudent })),
  toogleUpdateAvatar: () => set(state => ({ openUpdateAvatar: !state.openUpdateAvatar })),
  toogleViewDetail: () => set(state => ({ openViewDetail: !state.openViewDetail })),
  toogleViewAvatar: () => set(state => ({ openViewAvatar: !state.openViewAvatar }))
}))
