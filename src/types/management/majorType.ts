export type Major = {
  _id: string
  majorId: string
  majorName: string
  createdAt: string | Date
  updatedAt: string | Date
}

export type MajorRes = {
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  majors: Major[]
}

export type MajorForm = {
  majorId: string
  majorName: string
}
