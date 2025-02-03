import { create } from 'zustand'

import type { Cohort } from '@/types/management/cohortType'

type State = {
  cohorts: Cohort[]
  cohort: Cohort | null
  openAddCohort: boolean
  openUpdateCohort: boolean
  openDeleteCohort: boolean
  openViewCohort: boolean
}

type Action = {
  setCohorts: (cohorts: Cohort[]) => void
  setCohort: (cohort: Cohort) => void
  toogleAddCohort: () => void
  toogleUpdateCohort: () => void
  toogleDeleteCohort: () => void
  toogleViewCohort: () => void
}

export const useCohortStore = create<State & Action>(set => ({
  cohorts: [],
  cohort: null,
  openAddCohort: false,
  openUpdateCohort: false,
  openDeleteCohort: false,
  openViewCohort: false,

  setCohorts: cohorts => set({ cohorts }),
  setCohort: cohort => set({ cohort }),
  toogleAddCohort: () => set(state => ({ openAddCohort: !state.openAddCohort })),
  toogleUpdateCohort: () => set(state => ({ openUpdateCohort: !state.openUpdateCohort })),
  toogleDeleteCohort: () => set(state => ({ openDeleteCohort: !state.openDeleteCohort })),
  toogleViewCohort: () => set(state => ({ openViewCohort: !state.openViewCohort }))
}))
