export type Term = {
  _id: string
  termName: string
  maxCourse: number
  startDate: string | Date
  endDate: string | Date
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
  maxCourse: number
  startDate: string | Date
  endDate: string | Date
}

export type UpdateTermType = {
  termName: string
  startDate: string | Date
  endDate: string | Date
}
