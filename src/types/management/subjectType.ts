export type SubjectType = {
  _id: string
  title: string
  credit: number
  cohortId: {
    _id: string
    cohortId: string
  }
  majorId: {
    _id: string
    majorId: string
    majorName: string
  }
  statusImport: boolean
  createdAt: string | Date
  updatedAt: string | Date
}

export type SubjectTypeList = {
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  data: SubjectType[]
}
