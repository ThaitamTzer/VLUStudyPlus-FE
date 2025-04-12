export type ChangeCategory = {
  level: number
  stt: string
  oldtitleN: string
  oldTitleV: string
  newTitleV: string
  oldCredits: number
  newCredit: string
}

export type NewCategory = {
  level: number
  titleN: string
  titleV: string
  credit: string
}

export type NewSubjects = {
  stt: string
  courseCode: string
  courseName: string
  credit: string
  LT: string
  TH: string
  TT: string
  isRequire: boolean
  prerequisites: string
  preConditions: string
  subjectCode: string
  inCharge: string
  implementationSemester: string
  note: string
}

export type ChangeSubjects = {
  stt: string
  oldCourseCode: string
  oldCourseName: string
  newCourseName: string
  oldCredits: number
  newCredits: string
  oldLT: number
  newLT: string
  oldTH: number
  newTH: string
  oldTT: number
  newTT: string
  oldIsRequired: boolean
  newIsRequired: boolean
  oldPrerequisites: string
  newPrerequisites: string
  oldPreConditions: string
  newPreConditions: string
  oldSubjectCode: string
  newSubjectCode: string
  oldInCharge: string
  newInCharge: string
  oldImplementationSemester: number
  newImplementationSemester: string
  oldNote: string
  newNote: string
}

export type CompareBeforeImportType = {
  message: string
  changes: ChangeCategory[]
  newCategory: NewCategory[]
  changeSubjects: ChangeSubjects[]
  newSubjects: NewSubjects[]
}
