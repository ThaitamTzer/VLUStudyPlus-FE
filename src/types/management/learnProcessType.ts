export type LearnProcessType = {
  _id: string
  title: string
  processId: string
  createdAt: string | Date
  updatedAt: string | Date
  isNotification: boolean
}

type ProcessingHandle = {
  statusProcess: string
  note: string
  _id: string
}

type CountWarning = {
  academicWarningsCount: number
  note: string
  _id: string
}

type CourseRegistration = {
  isRegister: boolean
  note: string
  _id: string
}

type StatusOn = {
  status: string
  note: string
  _id: string
}
type ReasonHandling = {
  reason: string
  note: string
  _id: string
}

export type Inserted = {
  academicCategory: string
  studentId: string
  lastName: string
  firstName: string
  cohortName: string
  classId: string
  groupedByInstruction: string
  sdtsv: string
  sdtlh: string
  sdthktt: string
  sdtcha: string
  sdtme: string
  major: string
  DTBC: number
  DTBCTL: number
  DTB10: number
  DTBCTL10: number
  TCTL: number
  TCCN: number
  TONGTCCTDT: number
  percentTL: number
  processingHandle: ProcessingHandle
  countWarning: CountWarning
  courseRegistration: CourseRegistration
  admissionYear: number
  RQS: string
  faculty: string
  list: string
  statusOn: StatusOn
  yearLevel: string
  reasonHandling: ReasonHandling
  resultHandlingBefore: string
  _id: string
  createdAt: string | Date
  updatedAt: string | Date
}

export type MissingInfoRows = {
  stt: string
  row: number
  message: string
  details: {
    studentId: string
  }
  data: any
}

export type ImportResult = {
  message: string
  data: {
    inserted: Inserted[]
    missingInfoRows: MissingInfoRows[]
    duplicateRows: MissingInfoRows[]
  }
}

export type processing = { statusHandling: string; termName: string; _id: string }
export type courseRegistration = { isRegister: boolean; note: string; termName: string; _id: string }
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

type major = {
  termName: string
  _id: string
}

export type ProcessingType = {
  _id: string
  commitment: boolean
  status: boolean
  academicCategory: {
    _id: string
    title: string
  }
  studentId: string
  lastName: string
  firstName: string
  classId: string
  cohortName: string
  processing: processing[]
  handlingStatusByAAO: string
  note: string
  courseRegistration: courseRegistration[]
  DTBC: number
  STC: number
  DTBCTL: number
  STCTL: number
  reasonHandling: string
  yearLevel: string
  faculty: string
  year: string
  termName: string
  major: major[]
  processingResult?: {
    _id: string
    processingResultName: string
    commitment: boolean
  }
  reason?: string
  createdAt: string | Date
  updatedAt: string | Date
}

export type ListProcessingType = {
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
  data: ProcessingType[]
}

export type ListClassInProcess = {
  userName: string
  classId: string
}

type Missing = {
  studentId: string
  message: string
}

export type CheckAcademicProcessing = {
  checkAcademicProcessing: ProcessingType
  informationClass: {
    _id: string
    lectureId: {
      _id: string
      mail: string
    }
    userId: string
    userName: string
  }
  student: {
    _id: string
    mail: string
    role: string
    isBlock: boolean
    dateOfBirth: string | Date
  }
  missingInfoRows: Missing[]
}
