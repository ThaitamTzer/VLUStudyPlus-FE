export type Student = {
  _id: string
  userId: string
  classCode: string
  academicYear: string
  cohortId: string
  userName: string
  mail: string
  role: {
    _id: string
    name: string
  }
  avatar: string
  isBlock: boolean
  createdAt: string | Date
  updatedAt: string | Date
  accessTime: string | Date
  dateOfBirth: string | Date
}

export type StudentType = {
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  students: Student[]
}

export type FormStudent = {
  userId: string
  userName: string
  classCode: string
  cohortId: string
  mail: string
  dateOfBirth: string
}

export type UpdateStudent = FormStudent & {
  role: string
}

export type StudentProfile = {
  _id: string
  userId: string
  classCode: string
  academicYear: string
  userName: string
  mail: string
  role: {
    name: string
    permissionID: number[]
  }
  avatar: string
  isBlock: boolean
  accessTime: string | Date
}

export type StudentResult = {
  userId: string
  classCode: string
  cohortId: string
  userName: string
  mail: string
  dateOfBirth: string
  role: string
  avatar: string
  isBlock: boolean
  _id: string
  createdAt: string | Date
  updatedAt: string | Date
}

export type ErrorImport = {
  sheet: string
  row: number
  message: string
  details: {
    userId: string
    userName: string
    mail: string
    classCode: string
    dateOfBirth: string
  }
}

export type ImportStudentRes = {
  message: string
  data: {
    message: string
    students: StudentResult[]
    updatedStudents: StudentResult[]
    missingInfoRows: ErrorImport[]
    duplicateRows: ErrorImport[]
  }
}
