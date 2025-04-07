'use client'

import { useContext } from 'react'

import { AbilityContext } from '@/contexts/AbilityContext'

// Enhanced hook with error handling
export const useAbility = () => {
  const ability = useContext(AbilityContext)

  if (!ability) {
    throw new Error('useAbility must be used within an AbilityProvider')
  }

  return ability
}
