import { create } from 'zustand'

import type { DuplicateRows, Lecturer, LecturerResult, MissingInfoRows } from '@/types/management/lecturerType'

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

  openPreviewImport: boolean
  lecturersResult: LecturerResult[]
  updateLecturers: LecturerResult[]
  missingInfoRows: MissingInfoRows[]
  duplicateRows: DuplicateRows[]
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

  setOpenPreviewImport: (open: boolean) => void
  setLecturersResult: (lecturers: LecturerResult[]) => void
  setUpdateLecturers: (lecturers: LecturerResult[]) => void
  setMissingInfoRows: (missingInfoRows: MissingInfoRows[]) => void
  setDuplicateRows: (duplicateRows: DuplicateRows[]) => void
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

  openPreviewImport: false,
  lecturersResult: [],
  updateLecturers: [],
  missingInfoRows: [],
  duplicateRows: [],

  setLecturers: lecturers => set({ lecturers }),
  setLecturer: lecturer => set({ lecturer }),
  setTotal: total => set({ total }),
  toogleAddLecturer: () => set(state => ({ openAddLecturer: !state.openAddLecturer })),
  toogleUpdateLecturer: () => set(state => ({ openUpdateLecturer: !state.openUpdateLecturer })),
  toogleBlockLecturer: () => set(state => ({ openBlockLecturer: !state.openBlockLecturer })),
  toogleUnBlockLecturer: () => set(state => ({ openUnBlockLecturer: !state.openUnBlockLecturer })),
  toogleUpdateAvatar: () => set(state => ({ openUpdateAvatar: !state.openUpdateAvatar })),
  toogleViewDetail: () => set(state => ({ openViewDetail: !state.openViewDetail })),
  toogleViewAvatar: () => set(state => ({ openViewAvatar: !state.openViewAvatar })),
  setOpenPreviewImport: open => set({ openPreviewImport: open }),
  setLecturersResult: lecturers => set({ lecturersResult: lecturers }),
  setUpdateLecturers: lecturers => set({ updateLecturers: lecturers }),
  setMissingInfoRows: missingInfoRows => set({ missingInfoRows }),
  setDuplicateRows: duplicateRows => set({ duplicateRows })
}))
