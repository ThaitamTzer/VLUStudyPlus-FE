import { create } from 'zustand'

import type { ClassStudentType } from '@/types/management/classStudentType'
import type { GradeType, TermGradesType } from '@/types/management/gradeTypes'
import type { ClassLecturer } from '@/types/management/classLecturerType'

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
  setClassLecturer: (classLecturer: ClassLecturer) => set({ classLecturer })
}))
