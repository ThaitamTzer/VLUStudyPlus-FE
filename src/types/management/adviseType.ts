export type AllAdviseType = {
  advise: string
  createdAdviseAt: string
  _id: string
}

export type AdviseType = {
  _id: string
  studentId: string
  termId: {
    _id: string
    abbreviatName: string
  }
  allAdvise: AllAdviseType[]
  createdAt: string | Date
  updatedAt: string | Date
}
