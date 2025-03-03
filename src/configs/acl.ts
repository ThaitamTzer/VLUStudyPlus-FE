import { AbilityBuilder, Ability } from '@casl/ability'

import permissions from '@/libs/permission.json'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any

export type ACLObj = {
  action: Actions
  subject: string
}

const defineRulesFor = (role: number[]) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  permissions.forEach(item => {
    if (role?.includes(item.id)) {
      can('read', 'homepage')
      can(item.action, item.subject)
    }
  })

  return rules
}

export const buildAbilityFor = (role: number[]): AppAbility => {
  return new AppAbility(defineRulesFor(role), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
