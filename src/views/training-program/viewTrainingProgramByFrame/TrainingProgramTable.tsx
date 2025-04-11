'use client'

import React from 'react'

import { Table, TableBody, TableContainer, IconButton, Tooltip } from '@mui/material'
import SubjectIcon from '@mui/icons-material/Book'

import type { KeyedMutator } from 'swr'

import type { TrainingProgramByFrame, Categories, Subjects } from '@/types/management/trainningProgramType'
import TableLoading from '@/components/table/TableLoading'
import TableNoData from '@/components/table/TableNotFound'
import CategorySection from './CategorySection'
import SubjectRow from './SubjectRow'
import CategoryRow from './CategoryRow'
import TrainingProgramHeader from './components/TrainingProgramHeader'
import ProgramRow from './components/ProgramRow'
import { useTrainingProgramStore } from '@/stores/trainingProgram.store'
import { useTrainingProgramTable } from './hooks/useTrainingProgramTable'
import DeleteSubjectModal from './DeleteSubjectModal'
import HistoryModal from './HistoryModal'

interface FlatTrainingProgramTableProps {
  data: TrainingProgramByFrame[]
  isLoading?: boolean
  mutate: KeyedMutator<any>
  programId?: string
}

const FlatTrainingProgramTable: React.FC<FlatTrainingProgramTableProps> = ({ data, isLoading, mutate, programId }) => {
  const {
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
    handleCancelSubject
  } = useTrainingProgramTable({ data, mutate })

  const { toogleOpenDeleteSubject, openDeleteSubject, subject, toogleOpenChangeHistory, openChangeHistory } =
    useTrainingProgramStore()

  // Helper function to recursively render categories with editing subjects
  const renderCategoryWithEditingSubject = (
    category: Categories,
    level: number,
    idCate1?: string,
    idCate2?: string,
    idCate3?: string
  ) => {
    return (
      <React.Fragment key={category._id}>
        <CategorySection
          category={category}
          level={level}
          mutate={mutate}
          onAddCategory={handleAddCategory}
          idCate1={idCate1 || ''}
          idCate2={idCate2 || ''}
          idCate3={idCate3 || ''}
          renderAddSubjectButton={() => (
            <Tooltip title='Thêm môn học'>
              <IconButton size='small' onClick={() => handleAddSubject(category._id)} sx={{ ml: 1 }}>
                <SubjectIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
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
            onCancel={handleCancelCategory}
          />
        )}

        {/* New subject being added to this category */}
        {editingNewSubject && editingNewSubject.categoryId === category._id && (
          <SubjectRow
            subject={editingNewSubject.subject}
            level={level + 1}
            isEditing={true}
            onSave={handleSaveSubject}
            onCancel={handleCancelSubject}
            programId={programId}
            categoryId={category._id}
            categoryLevel={level}
            idCate1={idCate1 || ''}
            idCate2={idCate2 || ''}
            idCate3={idCate3 || ''}
            mutate={mutate}
          />
        )}

        {/* Subjects directly under this category */}
        {category.subjects?.map((subject: Subjects) => (
          <SubjectRow
            key={subject._id}
            subject={subject}
            level={level + 1}
            programId={programId}
            categoryId={category._id}
            categoryLevel={level}
            idCate1={idCate1 || ''}
            idCate2={idCate2 || ''}
            idCate3={idCate3 || ''}
            mutate={mutate}
          />
        ))}

        {/* Recursively render subcategories */}
        {category.categoriesC3?.map(subCategory =>
          renderCategoryWithEditingSubject(subCategory, level + 1, idCate1, category._id, subCategory._id)
        )}
      </React.Fragment>
    )
  }

  return (
    <>
      <TableContainer>
        <Table aria-label='training program table' size='small' sx={{ minWidth: 1000 }}>
          <TrainingProgramHeader />
          <TableBody>
            {programData?.map(program => {
              return (
                <React.Fragment key={program._id}>
                  {/* Program header */}
                  <ProgramRow
                    program={program}
                    onAddSubject={handleAddTopLevelSubject}
                    onAddCategory={handleAddTopLevelCategory}
                    mutate={mutate}
                  />

                  {/* New category being added to this program */}
                  {editingNewCategory && editingNewCategory.programId === program._id && (
                    <CategoryRow
                      category={editingNewCategory.category}
                      level={2}
                      isEditing={true}
                      idCate1={editingNewCategory.idCate1 || ''}
                      idCate2={editingNewCategory.parentId || ''}
                      mutate={mutate}
                      onCancel={handleCancelCategory}
                    />
                  )}

                  {/* New subject being added to this program */}
                  {editingNewSubject && editingNewSubject.categoryId === program._id && (
                    <SubjectRow
                      subject={editingNewSubject.subject}
                      level={3}
                      isEditing={true}
                      onChange={handleSubjectChange}
                      onSave={handleSaveSubject}
                      onCancel={handleCancelSubject}
                      programId={programId}
                      categoryId={program._id}
                      categoryLevel={1}
                      idCate1={program._id}
                      idCate2={program._id}
                      idCate3={program._id}
                      mutate={mutate}
                    />
                  )}

                  {/* Subjects directly under program */}
                  {program.subjects?.map(subject => (
                    <SubjectRow
                      key={subject._id}
                      subject={subject}
                      level={2}
                      programId={programId}
                      idCate1={program._id}
                      idCate2={program._id}
                      idCate3={program._id}
                      mutate={mutate}
                    />
                  ))}

                  {/* Use the new helper function to render categories with editing subjects */}
                  {program.categories?.map(category =>
                    renderCategoryWithEditingSubject(category, 2, program._id, category._id)
                  )}
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
      <DeleteSubjectModal
        open={openDeleteSubject}
        onClose={toogleOpenDeleteSubject}
        subject={subject || ({} as Subjects)}
        onSuccess={mutate}
      />
      <HistoryModal open={openChangeHistory} onClose={toogleOpenChangeHistory} id={programId || ''} />
    </>
  )
}

export default FlatTrainingProgramTable
