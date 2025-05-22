export type ImportedResult = {
  _id: string
  userId: string
  classCode: string
  cohortId: string
  userName: string
  mail: string
  dateOfBirth: string | Date
  role: string
  avatar: string
  isBlock: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export type MissingInforType = {
  sheet: string
  row: number
  message: string
  details: {
    userId: string
    userName: string
    mail: string
    classCode: string
    dateOfBirth: string | Date
  }
}

export type ImportStudentResult = {
  message: string
  data: {
    message: string
    students: ImportedResult[]
    updatedStudents: ImportedResult[]
    missingInfoRows: MissingInforType[]
    duplicateRows: MissingInforType[]
  }
}

export type ClassStudentType = {
  _id: string
  userId: string
  classCode: string
  cohortId: string
  userName: string
  mail: string
  dateOfBirth: string | Date
  role: {
    _id: string
    name: string
  }
  avatar: string
  isBlock: boolean
  isActive: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export type ClassStudentListType = {
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  students: ClassStudentType[]
}
