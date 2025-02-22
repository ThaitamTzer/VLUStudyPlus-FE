import { create } from 'zustand'

import type { Class, ClassGroupByLecturer } from '@/types/management/classType'

type States = {
  classRoom: Class | null
  classFilter: ClassGroupByLecturer | null
  openAddClassModal: boolean
  openEditClassModal: boolean
  openDeleteClassModal: boolean
  openViewDetailModal: boolean

  openEditClassfilterModal: boolean
  openDeleteClassfilterModal: boolean
  openViewDetailfilterModal: boolean
}

type Actions = {
  setClass: (classData: Class) => void
  toogleOpenAddClassModal: () => void
  toogleOpenEditClassModal: () => void
  toogleOpenDeleteClassModal: () => void
  toogleOpenViewDetailModal: () => void
  setClassFilter: (classData: ClassGroupByLecturer) => void

  toogleOpenEditClassfilterModal: () => void
  toogleOpenDeleteClassfilterModal: () => void
  toogleOpenViewDetailfilterModal: () => void
}

export const useClassStore = create<States & Actions>(set => ({
  classRoom: null,
  openAddClassModal: false,
  openEditClassModal: false,
  openDeleteClassModal: false,
  openViewDetailModal: false,
  classFilter: null,

  openEditClassfilterModal: false,
  openDeleteClassfilterModal: false,
  openViewDetailfilterModal: false,

  setClass: classData => set({ classRoom: classData }),
  toogleOpenAddClassModal: () => set(state => ({ openAddClassModal: !state.openAddClassModal })),
  toogleOpenEditClassModal: () => set(state => ({ openEditClassModal: !state.openEditClassModal })),
  toogleOpenDeleteClassModal: () => set(state => ({ openDeleteClassModal: !state.openDeleteClassModal })),
  toogleOpenViewDetailModal: () => set(state => ({ openViewDetailModal: !state.openViewDetailModal })),
  setClassFilter: classData => set({ classFilter: classData }),

  toogleOpenEditClassfilterModal: () => set(state => ({ openEditClassfilterModal: !state.openEditClassfilterModal })),
  toogleOpenDeleteClassfilterModal: () =>
    set(state => ({ openDeleteClassfilterModal: !state.openDeleteClassfilterModal })),
  toogleOpenViewDetailfilterModal: () => set(state => ({ openViewDetailfilterModal: !state.openViewDetailfilterModal }))
}))
