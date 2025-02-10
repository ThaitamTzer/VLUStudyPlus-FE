export type Term = {
  _id: string
  termId: string
  termName: string
  academicYear: string
  startDate: string | Date
  endDate: string | Date
  createdAt: string | Date
  updatedAt: string | Date
}

export type TermType = {
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  terms: Term[]
}

export type AddTermType = {
  termName: string
  academicYear: string
  startDate: string | Date
  endDate: string | Date
}

export type UpdateTermType = {
  termName: string
  academicYear: string
  startDate: string | Date
  endDate: string | Date
}
