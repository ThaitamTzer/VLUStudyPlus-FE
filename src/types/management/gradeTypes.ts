export type StudentType = {
  _id: string
  userId: string
  cohortId: string
  userName: string
  mail: string
  isActive: boolean
}
export type TermType = { _id: string; termName: string; abbreviatName: string; academicYear: string }

export type GradeOfSubjectType = {
  subjectId: {
    _id: string
    courseName: string
    credits: number
  }
  grade: number
  status: string
  _id: string
}

export type TermGradeType = {
  term: TermType
  gradeOfSubject: GradeOfSubjectType[]
  _id: string
  advise: string
}

export type GradeType = {
  _id: string
  studentId: StudentType
  majorOfStudent: null
  TCTL_CD: number
  TCTL_SV: number
  TCN: number
  isActive: boolean
  termGrades: TermGradeType[]
  createdAt: string | Date
  updatedAt: string | Date
}

export type GradeTypeByClassCode = {
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  data: GradeType[]
}

export type GradeOfSubject = {
  subjectId: {
    _id: string
    courseCode: string
    courseName: string
    credits: number
  }
  grade: number
  status: string
  _id: string
}

export type TermGradesType = {
  term: {
    _id: string
    termName: string
    abbreviatName: string
    academicYear: string
  }
  gradeOfSubject: GradeOfSubject[]
  _id: string
  advise: string
}

export type GradeTypeById = {
  _id: string
  studentId: string
  TCTL_CD: number
  TCTL_SV: number
  TCN: number
  termGrades: TermGradesType[]
  createdAt: string | Date
  updatedAt: string | Date
}
