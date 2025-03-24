export type TrainingProgramType = {
  _id: string
  title: string
  credit: number
  cohortId: {
    _id: string
    cohortId: string
  }
  createdAt: string | Date
  updatedAt: string | Date
}

export type TrainingProgramListType = {
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  data: TrainingProgramType[]
}
