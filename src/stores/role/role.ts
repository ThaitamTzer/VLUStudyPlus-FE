import { create } from 'zustand'

import type { Role } from '@/types/management/roleType'

type State = {
  roles: Role[]
  total: number
  openAddRoleModal: boolean
  openEditRoleModal: boolean
  openDeleteRoleModal: boolean
}

type Actions = {
  setRoles: (roles: Role[]) => void
  setTotal: (total: number) => void
  toogleAddRoleModal: () => void
  toogleEditRoleModal: () => void
  toogleDeleteRoleModal: () => void
}

export const useRoleStore = create<State & Actions>(set => ({
  roles: [],
  total: 0,
  openAddRoleModal: false,
  openEditRoleModal: false,
  openDeleteRoleModal: false,
  setRoles: roles => set({ roles }),
  setTotal: total => set({ total }),
  toogleAddRoleModal: () => set(state => ({ openAddRoleModal: !state.openAddRoleModal })),
  toogleEditRoleModal: () => set(state => ({ openEditRoleModal: !state.openEditRoleModal })),
  toogleDeleteRoleModal: () => set(state => ({ openDeleteRoleModal: !state.openDeleteRoleModal }))
}))
