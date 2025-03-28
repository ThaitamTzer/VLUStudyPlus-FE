export type ListStudentByClass = {
  _id: string
  userId: string
  classCode: string
  cohortId: string
  userName: string
  mail: string
  dateOfBirth: string
  role: string
  avatar: string
  isBlock: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export type Class = {
  _id: string
  lectureId: string
  userId: string
  userName: string
  classId: string
  cohortId: {
    _id: string
    cohortId: string
  }
  numberStudent: number
  statusImport: boolean
}

export type ClassData = {
  _id: string
  classId: string
  cohortId: {
    _id: string
    cohortId: string
  }
  numberStudent: number
  statusImport: boolean
}
export type ClassGroupByLecturer = {
  lectureId: {
    _id: string
    userName: string
    userId: string
    classes: ClassData[]
  }
}

export type ClassType = {
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  data: Class[] & ClassGroupByLecturer[]
}

export type FormClass = {
  lectureId?: string
  classId?: string
  cohortId?: string
  numberStudent?: number
  statusImport?: boolean
}

export type UpdateSuccess = {
  stt: string
  row: number
  message: string
  details: {
    userId: string
    userName: string
    userEmail: string
    numberStudents: number
    classId: string
  }
}

export type MissingError = UpdateSuccess & {
  details: {
    cohortId: string
  }
}
export type DuplicateClass = MissingError
export type ImportLecturer = {
  userId: string
  userName: string
  typeLecturer: string
  mail: string
  role: string
  avatar: string
  isBlock: boolean
  _id: string
  createdAt: string | Date
  updatedAt: string | Date
}
export type ImportSuccess = {
  _id: string
  userId: string
  userName: string
  classId: string
  cohortId: string
  numberStudent: number
  statusImport: false
  createdAt: string | Date
  updatedAt: string | Date
}

export type ViewImport = {
  message: string
  data: ImportSuccess[]
  lecturerData: ImportLecturer[]
  missingInfoRows: MissingError[]
  updateInfoRows: UpdateSuccess[]
  duplicateClass: DuplicateClass[]
}
