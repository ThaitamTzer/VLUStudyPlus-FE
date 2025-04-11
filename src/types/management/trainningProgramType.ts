import type { KeyedMutator } from 'swr'

export type TrainingProgramType = {
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

export type TrainingProgramListType = {
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  data: TrainingProgramType[]
}

export type Subjects = {
  _id: string
  categoryTrainingProgramIds: string[]
  courseCode: string
  courseName: string
  credits: number
  LT: number
  TH: number
  TT: number
  isRequire: string
  prerequisites: string
  preConditions: string
  subjectCode: string
  inCharge: string
  implementationSemester: string
  note: string
  createdAt: string | Date
  updatedAt: string | Date
}

export type ResCreateFrame = {
  title: string
  credit: number
  cohortId: string
  majorId: string
  _id: string
  createdAt: string | Date
  updatedAt: string | Date
}

export type CategoriesC3 = {
  _id: string
  titleN: string
  titleV: string
  credits: number
  subjects: Subjects[]
}

export type Categories = {
  _id: string
  titleN: string
  titleV: string
  credits: number
  subjects: Subjects[]
  categoriesC3?: CategoriesC3[]
  parentId?: string
}

export type TrainingProgramByFrame = {
  _id: string
  trainingProgramSessionId: string
  titleN: string
  titleV: string
  credits: number
  subjects: Subjects[]
  categories: Categories[]
  mutate?: KeyedMutator<any>
}

type ChangeSubjects = {
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
  newImplementationSemester: number
  oldNote: string
  newNote: string
}

type NewCategory = {
  level: number
  titleN: string
  titleV: string
  credits: number
}

type NewSubjects = {
  stt: string
  courseCode: string
  courseName: string
  credits: string
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
export type ImportChangeData = {
  message: string
  changes: []
  newCategory: NewCategory[]
  changeSubjects: ChangeSubjects[]
  newSubjects: NewSubjects[]
}
