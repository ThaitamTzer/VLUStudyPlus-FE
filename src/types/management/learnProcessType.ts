export type LearnProcessType = {
  _id: string
  title: string
  processId: string
  createdAt: string | Date
  updatedAt: string | Date
}

type Major = {
  termName: string
  _id: string
}

type Processing = {
  statusHandling: string
  termName: string
  _id: string
}

type CourseRegistration = {
  isRegister: boolean
  termName: string
  _id: string
}

export type Inserted = {
  academicCategory: string
  studentId: string
  lastName: string
  firstName: string
  classId: string
  cohortName: string
  major: Major[]
  processing: Processing[]
  handlingStatusByAAO: string
  note: string
  courseRegistration: CourseRegistration[]
  DTBC: number
  STC: number
  DTBCTL: number
  STCTL: number
  reasonHandling: string
  yearLevel: string
  faculty: string
  year: string
  termName: string
  _id: string
  createdAt: string | Date
  updatedAt: string | Date
}

export type MissingInfoRows = {
  stt: number
  row: number
  message: string
}

export type ImportResult = {
  message: string
  data: {
    inserted: Inserted[]
    missingInfoRows: MissingInfoRows[]
    duplicateRows: MissingInfoRows[]
  }
}

type processing = { statusHandling: string; termName: string }
type courseRegistration = { isRegister: boolean; note: string; termName: string }
export type AddProcessType = {
  academicCategory: string
  studentId: string
  lastName: string
  firstName: string
  classId: string
  cohortName: string
  processing: processing[]
  courseRegistration: courseRegistration[]
  handlingStatusByAAO: string
  note: string
  DTBC: number
  STC: number
  DTBCTL: number
  STCTL: number
  reasonHandling: string
  yearLevel: string
  faculty: string
  year: string
  termName: string
}
