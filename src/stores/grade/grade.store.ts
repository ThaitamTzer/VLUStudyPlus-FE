import { create } from 'zustand'

import type { ClassStudentType } from '@/types/management/classStudentType'
import type {
  GradeType,
  StudentType,
  TermGradesType,
  TermGradeType,
  GradeTypeById
} from '@/types/management/gradeTypes'
import type { ClassLecturer } from '@/types/management/classLecturerType'
import type { Subjects } from '@/types/management/trainningProgramType'

type States = {
  openUpdateGrade: boolean
  student: ClassStudentType | null
  openViewGradeDetail: boolean
  openUpdateGradeDetail: boolean
  gradeDetail: GradeType | null
  idGrade: string
  idClass: string
  cohortId: string
  openViewGrade: boolean
  termGrade: TermGradesType | null

  openImportGradeStudent: boolean
  openUpdateGradeStudent: boolean
  termGradeUpdate: TermGradesType | null
  classLecturer: ClassLecturer | null

  subjectId: string
  studentId: string
  subject: Subjects | null
  studentGrade: StudentType | null

  // For updating existing grade
  openUpdateExistingGrade: boolean
  currentTermGrade: TermGradeType | null
  currentGradeSubjectIndex: number
  isUpdatingExisting: boolean
  currentGradeId: string
  currentTermGradeId: string

  // For updating advise
  openUpdateAdvise: boolean
  currentAdviseGradeId: string
  currentAdviseTermId: string
  currentAdvise: string

  // For viewing advise history
  openViewAdviseHistory: boolean
  currentStudentGradeData: GradeTypeById | null
}

type Actions = {
  toogleUpdateGrade: () => void
  setStudent: (student: ClassStudentType) => void
  toogleViewGradeDetail: () => void
  toogleUpdateGradeDetail: () => void
  setGradeDetail: (gradeDetail: GradeType) => void
  setIdGrade: (idGrade: string) => void
  toogleViewGrade: () => void
  setIdClass: (idClass: string) => void
  setTermGrade: (termGrade: TermGradesType) => void
  setCohortId: (cohortId: string) => void
  setClassLecturer: (classLecturer: ClassLecturer) => void
  toogleImportGradeStudent: () => void
  toogleUpdateGradeStudent: () => void
  setTermGradeUpdate: (termGradeUpdate: TermGradesType) => void
  setSubjectId: (subjectId: string) => void
  setStudentId: (studentId: string) => void
  setSubject: (subject: Subjects) => void
  setStudentGrade: (student: StudentType) => void

  // For updating existing grade
  toogleUpdateExistingGrade: () => void
  setCurrentTermGrade: (termGrade: TermGradeType) => void
  setCurrentGradeSubjectIndex: (index: number) => void
  setIsUpdatingExisting: (isUpdating: boolean) => void
  setCurrentGradeId: (gradeId: string) => void
  setCurrentTermGradeId: (termGradeId: string) => void

  // For updating advise
  toogleUpdateAdvise: () => void
  setCurrentAdviseGradeId: (gradeId: string) => void
  setCurrentAdviseTermId: (termId: string) => void
  setCurrentAdvise: (advise: string) => void

  // For viewing advise history
  toogleViewAdviseHistory: () => void
  setCurrentStudentGradeData: (gradeData: GradeTypeById) => void
}

export const useGradeStore = create<States & Actions>(set => ({
  openUpdateGrade: false,
  student: null,
  openViewGradeDetail: false,
  openUpdateGradeDetail: false,
  gradeDetail: null,
  idGrade: '',
  idClass: '',
  openViewGrade: false,
  termGrade: null,
  openImportGradeStudent: false,
  openUpdateGradeStudent: false,
  termGradeUpdate: null,
  cohortId: '',
  classLecturer: null,
  subjectId: '',
  studentId: '',
  subject: null,
  studentGrade: null,

  // For updating existing grade
  openUpdateExistingGrade: false,
  currentTermGrade: null,
  currentGradeSubjectIndex: -1,
  isUpdatingExisting: false,
  currentGradeId: '',
  currentTermGradeId: '',

  // For updating advise
  openUpdateAdvise: false,
  currentAdviseGradeId: '',
  currentAdviseTermId: '',
  currentAdvise: '',

  // For viewing advise history
  openViewAdviseHistory: false,
  currentStudentGradeData: null,

  toogleUpdateGrade: () => set(state => ({ openUpdateGrade: !state.openUpdateGrade })),
  setStudent: (student: ClassStudentType) => set({ student }),
  toogleViewGradeDetail: () => set(state => ({ openViewGradeDetail: !state.openViewGradeDetail })),
  toogleUpdateGradeDetail: () => set(state => ({ openUpdateGradeDetail: !state.openUpdateGradeDetail })),
  setGradeDetail: (gradeDetail: GradeType) => set({ gradeDetail }),
  setIdGrade: (idGrade: string) => set({ idGrade }),
  toogleViewGrade: () => set(state => ({ openViewGrade: !state.openViewGrade })),
  setIdClass: (idClass: string) => set({ idClass }),
  setTermGrade: (termGrade: TermGradesType) => set({ termGrade }),
  setCohortId: (cohortId: string) => set({ cohortId }),
  toogleImportGradeStudent: () => set(state => ({ openImportGradeStudent: !state.openImportGradeStudent })),
  toogleUpdateGradeStudent: () => set(state => ({ openUpdateGradeStudent: !state.openUpdateGradeStudent })),
  setTermGradeUpdate: (termGradeUpdate: TermGradesType) => set({ termGradeUpdate }),
  setClassLecturer: (classLecturer: ClassLecturer) => set({ classLecturer }),
  setSubjectId: (subjectId: string) => set({ subjectId }),
  setStudentId: (studentId: string) => set({ studentId }),
  setSubject: (subject: Subjects) => set({ subject }),
  setStudentGrade: (studentGrade: StudentType) => set({ studentGrade }),

  // For updating existing grade
  toogleUpdateExistingGrade: () => set(state => ({ openUpdateExistingGrade: !state.openUpdateExistingGrade })),
  setCurrentTermGrade: (currentTermGrade: TermGradeType) => set({ currentTermGrade }),
  setCurrentGradeSubjectIndex: (currentGradeSubjectIndex: number) => set({ currentGradeSubjectIndex }),
  setIsUpdatingExisting: (isUpdatingExisting: boolean) => set({ isUpdatingExisting }),
  setCurrentGradeId: (currentGradeId: string) => set({ currentGradeId }),
  setCurrentTermGradeId: (currentTermGradeId: string) => set({ currentTermGradeId }),

  // For updating advise
  toogleUpdateAdvise: () => set(state => ({ openUpdateAdvise: !state.openUpdateAdvise })),
  setCurrentAdviseGradeId: (currentAdviseGradeId: string) => set({ currentAdviseGradeId }),
  setCurrentAdviseTermId: (currentAdviseTermId: string) => set({ currentAdviseTermId }),
  setCurrentAdvise: (currentAdvise: string) => set({ currentAdvise }),

  // For viewing advise history
  toogleViewAdviseHistory: () => set(state => ({ openViewAdviseHistory: !state.openViewAdviseHistory })),
  setCurrentStudentGradeData: (gradeData: GradeTypeById) => set({ currentStudentGradeData: gradeData })
}))
