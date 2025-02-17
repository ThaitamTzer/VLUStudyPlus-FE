import { create } from 'zustand'

import type { Class } from '@/types/management/classType'

type States = {
  classRoom: Class | null
  openAddClassModal: boolean
  openEditClassModal: boolean
  openDeleteClassModal: boolean
  openViewDetailModal: boolean
}

type Actions = {
  setClass: (classData: Class) => void
  toogleOpenAddClassModal: () => void
  toogleOpenEditClassModal: () => void
  toogleOpenDeleteClassModal: () => void
  toogleOpenViewDetailModal: () => void
}

export const useClassStore = create<States & Actions>(set => ({
  classRoom: null,
  openAddClassModal: false,
  openEditClassModal: false,
  openDeleteClassModal: false,
  openViewDetailModal: false,

  setClass: classData => set({ classRoom: classData }),
  toogleOpenAddClassModal: () => set(state => ({ openAddClassModal: !state.openAddClassModal })),
  toogleOpenEditClassModal: () => set(state => ({ openEditClassModal: !state.openEditClassModal })),
  toogleOpenDeleteClassModal: () => set(state => ({ openDeleteClassModal: !state.openDeleteClassModal })),
  toogleOpenViewDetailModal: () => set(state => ({ openViewDetailModal: !state.openViewDetailModal }))
}))
