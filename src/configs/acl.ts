import { AbilityBuilder, Ability } from '@casl/ability'

import type { UserType } from '../types/userType'
import permissions from '@/libs/permission.json'

export function defineAbilityFor(user: UserType) {
  const { can, build } = new AbilityBuilder(Ability)

  if (user?.role?.permissionID) {
    user.role.permissionID.forEach(id => {
      const permission = permissions.find(p => p.id === id)

      if (permission) {
        can(permission.action, permission.subject)
      }
    })
  }

  return build()
}
