export type Class = {
  _id: string
  lectureId: {
    _id: string
    userId: string
    userName: string
  }
  userId: string
  classId: string
  cohortId: {
    _id: string
    cohortId: string
  }
  numberStudent: number
  statusImport: boolean
}

export type ClassType = {
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  classs: Class[]
}

export type FormClass = {
  lectureId?: string
  userId?: string
  classId?: string
  cohortId?: string
  numberStudent?: number
  statusImport?: boolean
}
