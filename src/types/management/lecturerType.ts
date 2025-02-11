import type { Student, StudentProfile } from './studentType'

export type Lecturer = Student & {
  typeLecturer: 'visiting' | 'permanent'
}

export type LecturerType = {
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  lecturers: Lecturer[]
}

export type LecturerProfile = StudentProfile

export type FormLecturer = {
  userId: string
  userName: string
  typeLecturer: 'visiting' | 'permanent'
  mail: string
  role: string
}
