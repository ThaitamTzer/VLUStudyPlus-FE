export type Term = {
  _id: string
  termName: string
  abbreviatName: string
  academicYear: string
  startDate: string | Date
  endDate: string | Date
  status: string
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
  abbreviatName: string
  academicYear: string
  startDate: string | Date
  endDate: string | Date
}

export type UpdateTermType = {
  termName: string
  abbreviatName: string
  academicYear: string
  startDate: string | Date
  endDate: string | Date
}
