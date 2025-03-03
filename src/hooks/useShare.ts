'use client'

import { useContext } from 'react'

import { ShareContext } from '@/contexts/ShareContext'

export const useShare = () => useContext(ShareContext)
