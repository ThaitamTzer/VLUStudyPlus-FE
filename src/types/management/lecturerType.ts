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

export type MissingInfoRows = {
  stt: string
  row: number
  message: string
  details: {
    maGV: string
    hoVaTen: string
    mail: string
    vaiTro: string
  }
}

export type DuplicateRows = {
  stt: string
  row: number
  message: string
  details: {
    mail: string
    maGV: string
  }
}

export type LecturerResult = {
  _id: string
  userId: string
  userName: string
  mail: string
  listClassId: string[]
  role: string
  avatar: string
  isBlock: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export type LecturerImportPreview = {
  message: string
  data: {
    message: string
    lecturers: LecturerResult[]
    updateLec: LecturerResult[]
    missingInfoRows: MissingInfoRows[]
    duplicateRows: DuplicateRows[]
  }
}
