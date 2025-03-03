'use client'

import { createContext } from 'react'

import type { AnyAbility } from '@casl/ability'
import { createContextualCan } from '@casl/react'

export const AbilityContext = createContext<AnyAbility>({} as AnyAbility)

export default createContextualCan(AbilityContext.Consumer)
