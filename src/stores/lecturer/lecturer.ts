import { create } from 'zustand'

import type { Lecturer } from '@/types/management/lecturerType'

type State = {
  lecturers: Lecturer[]
  lecturer: Lecturer | null
  total: number
  openAddLecturer: boolean
  openUpdateLecturer: boolean
  openBlockLecturer: boolean
  openUnBlockLecturer: boolean
  openUpdateAvatar: boolean
  openViewDetail: boolean
  openViewAvatar: boolean
}

type Action = {
  setLecturers: (lecturers: Lecturer[]) => void
  setLecturer: (lecturer: Lecturer) => void
  setTotal: (total: number) => void
  toogleAddLecturer: () => void
  toogleUpdateLecturer: () => void
  toogleBlockLecturer: () => void
  toogleUnBlockLecturer: () => void
  toogleUpdateAvatar: () => void
  toogleViewDetail: () => void
  toogleViewAvatar: () => void
}

export const useLecturerStore = create<State & Action>(set => ({
  lecturers: [],
  lecturer: null,
  total: 0,
  openAddLecturer: false,
  openUpdateLecturer: false,
  openBlockLecturer: false,
  openUnBlockLecturer: false,
  openUpdateAvatar: false,
  openViewDetail: false,
  openViewAvatar: false,
  setLecturers: lecturers => set({ lecturers }),
  setLecturer: lecturer => set({ lecturer }),
  setTotal: total => set({ total }),
  toogleAddLecturer: () => set(state => ({ openAddLecturer: !state.openAddLecturer })),
  toogleUpdateLecturer: () => set(state => ({ openUpdateLecturer: !state.openUpdateLecturer })),
  toogleBlockLecturer: () => set(state => ({ openBlockLecturer: !state.openBlockLecturer })),
  toogleUnBlockLecturer: () => set(state => ({ openUnBlockLecturer: !state.openUnBlockLecturer })),
  toogleUpdateAvatar: () => set(state => ({ openUpdateAvatar: !state.openUpdateAvatar })),
  toogleViewDetail: () => set(state => ({ openViewDetail: !state.openViewDetail })),
  toogleViewAvatar: () => set(state => ({ openViewAvatar: !state.openViewAvatar }))
}))
