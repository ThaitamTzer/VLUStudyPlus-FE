import { create } from 'zustand'

import type { Role } from '@/types/management/roleType'

type State = {
  roles: Role[]
  role: Role
  total: number
  openAddRoleModal: boolean
  openEditRoleModal: boolean
  openDeleteRoleModal: boolean
}

type Actions = {
  setRoles: (roles: Role[]) => void
  setRole: (role: Role) => void
  setTotal: (total: number) => void
  toogleAddRoleModal: () => void
  toogleEditRoleModal: () => void
  toogleDeleteRoleModal: () => void
}

export const useRoleStore = create<State & Actions>(set => ({
  roles: [],
  role: {} as Role,
  total: 0,
  openAddRoleModal: false,
  openEditRoleModal: false,
  openDeleteRoleModal: false,
  setRoles: roles => set({ roles }),
  setRole: role => set({ role }),
  setTotal: total => set({ total }),
  toogleAddRoleModal: () => set(state => ({ openAddRoleModal: !state.openAddRoleModal })),
  toogleEditRoleModal: () => set(state => ({ openEditRoleModal: !state.openEditRoleModal })),
  toogleDeleteRoleModal: () => set(state => ({ openDeleteRoleModal: !state.openDeleteRoleModal }))
}))
