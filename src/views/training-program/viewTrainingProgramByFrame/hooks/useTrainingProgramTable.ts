import { useState, useEffect } from 'react'

import type { KeyedMutator } from 'swr'

import type { TrainingProgramByFrame, Categories, Subjects } from '@/types/management/trainningProgramType'

// New empty category template
const emptyCategory: Omit<Categories, '_id'> = {
  titleN: '',
  titleV: '',
  credits: 0,
  subjects: [],
  categoriesC3: []
}

// New empty subject template
const emptySubject: Omit<Subjects, '_id'> = {
  courseCode: '',
  courseName: '',
  credits: 0,
  LT: 0,
  TH: 0,
  TT: 0,
  isRequire: 'true',
  prerequisites: '',
  preConditions: '',
  implementationSemester: '',
  categoryTrainingProgramIds: [],
  subjectCode: '',
  inCharge: '',
  note: '',
  createdAt: '',
  updatedAt: ''
}

interface UseTrainingProgramTableProps {
  data: TrainingProgramByFrame[]
  mutate: KeyedMutator<any>
}

export const useTrainingProgramTable = ({ data, mutate }: UseTrainingProgramTableProps) => {
  const [programData, setProgramData] = useState<TrainingProgramByFrame[]>(data || [])

  // Track editing states
  const [editingNewCategory, setEditingNewCategory] = useState<{
    parentId: string | null
    programId: string | null
    category: Categories & { _id: string }
    idCate1: string | null
  } | null>(null)

  const [editingNewSubject, setEditingNewSubject] = useState<{
    categoryId: string
    subject: Subjects & { _id: string }
  } | null>(null)

  // Update local data when prop changes
  useEffect(() => {
    setProgramData(data || [])
  }, [data])

  // Add a new subcategory to a parent category
  const handleAddCategory = (parentId: string, idCate1: string) => {
    const newCategory = {
      ...emptyCategory,
      _id: `temp-${Date.now()}`
    } as Categories & { _id: string }

    setEditingNewCategory({
      parentId,
      programId: null,
      category: newCategory,
      idCate1
    })
  }

  // Add a new subject to a category
  const handleAddSubject = (categoryId: string) => {
    const newSubject = {
      ...emptySubject,
      _id: `temp-${Date.now()}`
    } as Subjects & { _id: string }

    setEditingNewSubject({
      categoryId,
      subject: newSubject
    })
  }

  // Add a new top-level category to a program
  const handleAddTopLevelCategory = (programId: string) => {
    const newCategory = {
      ...emptyCategory,
      _id: `temp-${Date.now()}`
    } as Categories & { _id: string }

    setEditingNewCategory({
      parentId: null,
      programId,
      category: newCategory,
      idCate1: programId
    })
  }

  // Add a new top-level subject to a program
  const handleAddTopLevelSubject = (programId: string) => {
    const newSubject = {
      ...emptySubject,
      _id: `temp-${Date.now()}`
    } as Subjects & { _id: string }

    setEditingNewSubject({
      categoryId: programId,
      subject: newSubject
    })
  }

  // Update fields of the new subject
  const handleSubjectChange = (field: keyof Subjects, value: any) => {
    if (!editingNewSubject) return

    setEditingNewSubject({
      ...editingNewSubject,
      subject: {
        ...editingNewSubject.subject,
        [field]: value
      }
    })
  }

  // Save the new subject
  const handleSaveSubject = () => {
    if (!editingNewSubject) return

    const updatedData = [...programData]
    const { categoryId, subject } = editingNewSubject

    for (const program of updatedData) {
      // Find the category in the program's categories tree
      const updateCategory = (categories: Categories[]): boolean => {
        for (let i = 0; i < categories.length; i++) {
          if (categories[i]._id === categoryId) {
            if (!categories[i].subjects) {
              categories[i].subjects = []
            }

            categories[i].subjects.push(subject)

            return true
          }

          if (categories[i].categoriesC3?.length) {
            if (updateCategory(categories[i].categoriesC3 || [])) {
              return true
            }
          }
        }

        return false
      }

      if (program.categories && updateCategory(program.categories)) {
        break
      }
    }

    setProgramData(updatedData)
    setEditingNewSubject(null)
  }

  // Cancel adding new category
  const handleCancelCategory = () => {
    setEditingNewCategory(null)
  }

  // Cancel adding new subject
  const handleCancelSubject = () => {
    setEditingNewSubject(null)
  }

  return {
    programData,
    editingNewCategory,
    editingNewSubject,
    handleAddCategory,
    handleAddSubject,
    handleAddTopLevelCategory,
    handleAddTopLevelSubject,
    handleSubjectChange,
    handleSaveSubject,
    handleCancelCategory,
    handleCancelSubject,
    mutate
  }
}
