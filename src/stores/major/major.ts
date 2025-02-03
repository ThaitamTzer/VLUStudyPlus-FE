import { create } from 'zustand'

import type { Major } from '@/types/management/majorType'

type State = {
  majors: Major[]
  major: Major | null
  total: number
  openAddMajor: boolean
  openUpdateMajor: boolean
  openDeleteMajor: boolean
  openViewMajor: boolean
}

type Actions = {
  setMajors: (majors: Major[]) => void
  setMajor: (major: Major) => void
  setTotal: (total: number) => void
  toogleAddMajor: () => void
  toogleUpdateMajor: () => void
  toogleDeleteMajor: () => void
  toogleViewMajor: () => void
}

export const useMajorStore = create<State & Actions>(set => ({
  majors: [],
  major: null,
  total: 0,
  openAddMajor: false,
  openUpdateMajor: false,
  openDeleteMajor: false,
  openViewMajor: false,

  setMajors: majors => set({ majors }),
  setMajor: major => set({ major }),
  setTotal: total => set({ total }),
  toogleAddMajor: () => set(state => ({ openAddMajor: !state.openAddMajor })),
  toogleUpdateMajor: () => set(state => ({ openUpdateMajor: !state.openUpdateMajor })),
  toogleDeleteMajor: () => set(state => ({ openDeleteMajor: !state.openDeleteMajor })),
  toogleViewMajor: () => set(state => ({ openViewMajor: !state.openViewMajor }))
}))
