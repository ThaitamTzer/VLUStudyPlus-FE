import type { Lecturer } from '@/types/management/lecturerType'
import type { UserType } from '@/types/userType'

export type AuthValuesType = {
  loading: boolean
  setLoading: (loading: boolean) => void
  logout: () => void
  user: UserType | null
  setUser: (user: UserType | null) => void
  getProfile: () => void
  lecturerData: Lecturer[] | null
  setLecturerData: (lecturerData: Lecturer[] | null) => void
}
