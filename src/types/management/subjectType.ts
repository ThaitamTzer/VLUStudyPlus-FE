export type SubjectType = {
  _id: string
  categoryTrainingProgramIds: [null]
  courseCode: string
  courseName: string
  credits: number
  LT: number
  TH: number
  TT: number
  isRequire: boolean
  prerequisites: string
  preConditions: string
  subjectCode: string
  inCharge: string
  implementationSemester: number
  note: string
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
