'use client'

import React, { useState } from 'react'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip } from '@mui/material'
import SubjectIcon from '@mui/icons-material/Book'
import CategoryIcon from '@mui/icons-material/Folder'

import type { KeyedMutator } from 'swr'

import StyledTableRow from '@/components/table/StyledTableRow'
import type { Categories, Subjects, TrainingProgramByFrame } from '@/types/management/trainningProgramType'
import { useSettings } from '@/@core/hooks/useSettings'
import TableLoading from '@/components/table/TableLoading'
import TableNoData from '@/components/table/TableNotFound'
import CategoryRow from './CategoryRow'
import SubjectRow from './SubjectRow'
import CategorySection from './CategorySection'

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

interface FlatTrainingProgramTableProps {
  data: TrainingProgramByFrame[]
  isLoading?: boolean
  mutate: KeyedMutator<any>
}

const FlatTrainingProgramTable: React.FC<FlatTrainingProgramTableProps> = ({ data, isLoading, mutate }) => {
  const { settings } = useSettings()
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

  // const [editingCategory, setEditingCategory] = useState<{
  //   originalId: string // ID của danh mục gốc
  //   category: Categories & { _id: string }
  //   level: number
  // } | null>(null)

  // Update local data when prop changes
  React.useEffect(() => {
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
      idCate1 // Thêm idCate1 vào state
    })
  }

  // Add a new subject to a category
  const handleAddSubject = (categoryId: string) => {
    // Create a temporary subject with ID
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
    // Create a temporary category with ID
    const newCategory = {
      ...emptyCategory,
      _id: `temp-${Date.now()}`
    } as Categories & { _id: string }

    setEditingNewCategory({
      parentId: null,
      programId,
      category: newCategory,
      idCate1: programId // Thêm idCate1 vào state
    })
  }

  //Add a new top-level subject to a program
  const handleAddTopLevelSubject = (programId: string) => {
    // Create a temporary subject with ID
    const newSubject = {
      ...emptySubject,
      _id: `temp-${Date.now()}`
    } as Subjects & { _id: string }

    setEditingNewSubject({
      categoryId: programId,
      subject: newSubject
    })
  }

  // const handleStartEditCategory = (category: Categories, level: number) => {
  //   setEditingCategory({
  //     originalId: category._id,
  //     category: { ...category },
  //     level
  //   })
  // }

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

  // Save the new category
  const handleSaveCategory = () => {
    if (!editingNewCategory) return

    const updatedData = [...programData]
    const { parentId, programId, category } = editingNewCategory

    if (programId) {
      // Adding to top level program
      const programIndex = updatedData.findIndex(p => p._id === programId)

      if (programIndex !== -1) {
        if (!updatedData[programIndex].categories) {
          updatedData[programIndex].categories = []
        }

        updatedData[programIndex].categories!.push(category)
      }
    } else if (parentId) {
      // Adding to a subcategory - need to find it in the hierarchy
      for (const program of updatedData) {
        // Find the category in the program's categories tree
        const updateCategory = (categories: Categories[]): boolean => {
          for (let i = 0; i < categories.length; i++) {
            if (categories[i]._id === parentId) {
              if (!categories[i].categoriesC3) {
                categories[i].categoriesC3 = []
              }

              categories[i].categoriesC3?.push(category)

              return true
            }

            if (categories[i].categoriesC3?.length) {
              if (categories[i].categoriesC3 && updateCategory(categories[i].categoriesC3 || [])) {
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
    }

    setProgramData(updatedData)
    setEditingNewCategory(null)
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

  // Helper function to recursively render categories with editing subjects
  const renderCategoryWithEditingSubject = (category: Categories, level: number, idCate1?: string) => {
    return (
      <React.Fragment key={category._id}>
        <CategorySection
          category={category}
          level={level}
          onAddCategory={handleAddCategory}
          onAddSubject={handleAddSubject}
          idCate1={idCate1 || ''}
        />

        {/* New category being added under this category */}
        {editingNewCategory && editingNewCategory.parentId === category._id && (
          <CategoryRow
            category={editingNewCategory.category}
            level={level + 1}
            isEditing={true}
            idCate1={editingNewCategory.idCate1 || ''}
            idCate2={editingNewCategory.parentId || ''}
            mutate={mutate}
            onSave={handleSaveCategory}
            onCancel={handleCancelCategory}
          />
        )}

        {/* New subject being added to this category - HIỂN THỊ TRƯỚC DANH SÁCH MÔN HỌC */}
        {editingNewSubject && editingNewSubject.categoryId === category._id && (
          <SubjectRow
            subject={editingNewSubject.subject}
            level={level + 1}
            isEditing={true}
            onChange={handleSubjectChange}
            onSave={handleSaveSubject}
            onCancel={handleCancelSubject}
          />
        )}

        {/* Subjects directly under this category */}
        {category.subjects?.map(subject => <SubjectRow key={subject._id} subject={subject} level={level + 1} />)}

        {/* Recursively render subcategories */}
        {category.categoriesC3?.map(subCategory => renderCategoryWithEditingSubject(subCategory, level + 1))}
      </React.Fragment>
    )
  }

  return (
    <TableContainer>
      <Table aria-label='training program table' size='small' sx={{ minWidth: 1000 }}>
        <TableHead>
          <StyledTableRow
            sx={{
              backgroundColor: settings.mode === 'dark' ? '#211C84' : '#3674B5',
              textTransform: 'uppercase'
            }}
          >
            <TableCell width={400} sx={{ fontWeight: 'bold' }}>
              Môn học
            </TableCell>
            <TableCell width={100} align='right' sx={{ fontWeight: 'bold' }}>
              TC
            </TableCell>
            <TableCell width={100} align='right' sx={{ fontWeight: 'bold' }}>
              STLT
            </TableCell>
            <TableCell width={100} align='right' sx={{ fontWeight: 'bold' }}>
              STTH
            </TableCell>
            <TableCell width={100} align='right' sx={{ fontWeight: 'bold' }}>
              STTT
            </TableCell>
            <TableCell width={115} sx={{ fontWeight: 'bold' }}>
              Loại môn
            </TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>ĐK Tuyên Quyết</TableCell>
            <TableCell width={300} sx={{ fontWeight: 'bold' }}>
              ĐK học trước
            </TableCell>
            <TableCell width={100} sx={{ fontWeight: 'bold' }}>
              HKTK
            </TableCell>
            <TableCell width={200} sx={{ fontWeight: 'bold' }}>
              Hành động
            </TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {programData?.map(program => {
            return (
              <React.Fragment key={program._id}>
                {/* Program header */}
                <TableRow
                  sx={{
                    backgroundColor: settings.mode === 'dark' ? '#4D55CC' : '#578FCA'
                  }}
                >
                  <TableCell colSpan={1} sx={{ fontWeight: 'bold' }}>
                    {program.titleN} {program.titleV}
                  </TableCell>
                  <TableCell align='right'>{program.credits}</TableCell>
                  <TableCell colSpan={7} sx={{ textAlign: 'right' }}></TableCell>
                  <TableCell sx={{ textAlign: 'right' }}>
                    <Tooltip title='Thêm môn học'>
                      <IconButton size='small' onClick={() => handleAddTopLevelSubject(program._id)}>
                        <SubjectIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Thêm danh mục cấp 2'>
                      <IconButton size='small' onClick={() => handleAddTopLevelCategory(program._id)}>
                        <CategoryIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>

                {/* New category being added to this program - DISPLAY FIRST */}
                {editingNewCategory && editingNewCategory.programId === program._id && (
                  <CategoryRow
                    category={editingNewCategory.category}
                    level={2}
                    isEditing={true}
                    idCate1={editingNewCategory.idCate1 || ''}
                    idCate2={editingNewCategory.parentId || ''}
                    mutate={mutate}
                    onSave={handleSaveCategory}
                    onCancel={handleCancelCategory}
                  />
                )}

                {/* New subject being added to this program - DISPLAY FIRST */}
                {editingNewSubject && editingNewSubject.categoryId === program._id && (
                  <SubjectRow
                    subject={editingNewSubject.subject}
                    level={3}
                    isEditing={true}
                    onChange={handleSubjectChange}
                    onSave={handleSaveSubject}
                    onCancel={handleCancelSubject}
                  />
                )}

                {/* Subjects directly under program */}
                {program.subjects?.map(subject => <SubjectRow key={subject._id} subject={subject} level={2} />)}

                {/* Use the new helper function to render categories with editing subjects */}
                {program.categories?.map(category => renderCategoryWithEditingSubject(category, 2, program._id))}
              </React.Fragment>
            )
          })}
          {isLoading ? (
            <TableLoading colSpan={20} />
          ) : (
            <TableNoData notFound={programData?.length === 0} title={'Không tìm dữ liệu nào'} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default FlatTrainingProgramTable
