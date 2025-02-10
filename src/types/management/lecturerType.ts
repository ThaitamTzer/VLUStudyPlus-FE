import type { Student, StudentProfile } from './studentType'

export type Lecturer = Student

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
  typeLecturer: string
  mail: string
  role: string
  avatar: string
  isBlock: boolean
  accessTime: string | Date
}
