import { create } from 'zustand'

import type {
  Class,
  ClassData,
  ClassGroupByLecturer,
  DuplicateClass,
  ImportLecturer,
  ImportSuccess,
  MissingError,
  UpdateSuccess
} from '@/types/management/classType'

type States = {
  classRoom: Class | null
  classFilter: ClassGroupByLecturer | null
  openAddClassModal: boolean
  openEditClassModal: boolean
  openDeleteClassModal: boolean
  openViewDetailModal: boolean
  classForUpdate: ClassData
  classID: string
  openEditClassfilterModal: boolean
  openDeleteClassfilterModal: boolean
  openViewDetailfilterModal: boolean

  openImportResultModal: boolean

  importResultData: ImportSuccess[]
  lecturerDataImported: ImportLecturer[]
  missingErrorData: MissingError[]
  updateSuccessData: UpdateSuccess[]
  duplicateClassData: DuplicateClass[]
}

type Actions = {
  setClass: (classData: Class) => void
  toogleOpenAddClassModal: () => void
  toogleOpenEditClassModal: () => void
  toogleOpenDeleteClassModal: () => void
  toogleOpenViewDetailModal: () => void
  setClassFilter: (classData: ClassGroupByLecturer) => void
  setClassForUpdate: (classData: ClassData) => void
  setClassID: (classID: string) => void
  toogleOpenEditClassfilterModal: () => void
  toogleOpenDeleteClassfilterModal: () => void
  toogleOpenViewDetailfilterModal: () => void

  toogleOpenImportResultModal: () => void
  setImportResultData: (data: ImportSuccess[]) => void
  setLecturerDataImported: (data: ImportLecturer[]) => void
  setMissingErrorData: (data: MissingError[]) => void
  setUpdateSuccessData: (data: UpdateSuccess[]) => void
  setDuplicateClassData: (data: DuplicateClass[]) => void
}

export const useClassStore = create<States & Actions>(set => ({
  classRoom: null,
  openAddClassModal: false,
  openEditClassModal: false,
  openDeleteClassModal: false,
  openViewDetailModal: false,
  classFilter: null,
  classForUpdate: {} as ClassData,
  classID: '',
  openEditClassfilterModal: false,
  openDeleteClassfilterModal: false,
  openViewDetailfilterModal: false,
  setClass: classData => set({ classRoom: classData }),
  toogleOpenAddClassModal: () => set(state => ({ openAddClassModal: !state.openAddClassModal })),
  toogleOpenEditClassModal: () => set(state => ({ openEditClassModal: !state.openEditClassModal })),
  toogleOpenDeleteClassModal: () => set(state => ({ openDeleteClassModal: !state.openDeleteClassModal })),
  toogleOpenViewDetailModal: () => set(state => ({ openViewDetailModal: !state.openViewDetailModal })),
  setClassFilter: classData => set({ classFilter: classData }),
  setClassForUpdate: classData => set({ classForUpdate: classData }),
  setClassID: classID => set({ classID }),
  toogleOpenEditClassfilterModal: () => set(state => ({ openEditClassfilterModal: !state.openEditClassfilterModal })),
  toogleOpenDeleteClassfilterModal: () =>
    set(state => ({ openDeleteClassfilterModal: !state.openDeleteClassfilterModal })),
  toogleOpenViewDetailfilterModal: () =>
    set(state => ({ openViewDetailfilterModal: !state.openViewDetailfilterModal })),

  openImportResultModal: false,
  importResultData: [],
  lecturerDataImported: [],
  missingErrorData: [],
  updateSuccessData: [],
  duplicateClassData: [],
  toogleOpenImportResultModal: () => set(state => ({ openImportResultModal: !state.openImportResultModal })),
  setImportResultData: data => set({ importResultData: data }),
  setLecturerDataImported: data => set({ lecturerDataImported: data }),
  setMissingErrorData: data => set({ missingErrorData: data }),
  setUpdateSuccessData: data => set({ updateSuccessData: data }),
  setDuplicateClassData: data => set({ duplicateClassData: data })
}))
