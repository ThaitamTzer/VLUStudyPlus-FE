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

export type MissingError = {
  stt: string
  row: number
  message: string
  details: {
    userId: string
    userName: string
    userEmail: string
    numberStudents: number
    classId: string
    cohortId: string
  }
}
