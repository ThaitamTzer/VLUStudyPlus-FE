import { create } from 'zustand'

import type { Term } from '@/types/management/termType'

type State = {
  term: Term
  terms: Term[]
  total: number
  openAddTerm: boolean
  openUpdateTerm: boolean
  openDeleteTerm: boolean
  openViewTerm: boolean
}

type Actions = {
  setTerm: (term: Term) => void
  setTerms: (terms: Term[]) => void
  setTotal: (total: number) => void
  toogleAddTerm: () => void
  toogleUpdateTerm: () => void
  toogleDeleteTerm: () => void
  toogleViewTerm: () => void
}

export const useTermStore = create<State & Actions>(set => ({
  term: {} as Term,
  terms: [],
  total: 0,
  openAddTerm: false,
  openUpdateTerm: false,
  openDeleteTerm: false,
  openViewTerm: false,
  setTerm: term => set({ term }),
  setTerms: terms => set({ terms }),
  setTotal: total => set({ total }),
  toogleAddTerm: () => set(state => ({ openAddTerm: !state.openAddTerm })),
  toogleUpdateTerm: () => set(state => ({ openUpdateTerm: !state.openUpdateTerm })),
  toogleDeleteTerm: () => set(state => ({ openDeleteTerm: !state.openDeleteTerm })),
  toogleViewTerm: () => set(state => ({ openViewTerm: !state.openViewTerm }))
}))
