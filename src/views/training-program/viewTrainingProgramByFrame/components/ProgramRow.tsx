'use client'

import React, { useCallback, useState } from 'react'

import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material'
import SubjectIcon from '@mui/icons-material/Book'
import CategoryIcon from '@mui/icons-material/Folder'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import type { KeyedMutator } from 'swr'

import { useSettings } from '@/@core/hooks/useSettings'
import { useTrainingProgramStore } from '@/stores/trainingProgram.store'
import type { TrainingProgramByFrame } from '@/types/management/trainningProgramType'
import UpdateCategory1Modal from '../UpdateCategory1Modal'
import DeleteCategoryModal from '../DeleteCategoryModal'

interface ProgramRowProps {
  program: TrainingProgramByFrame
  onAddSubject: (programId: string) => void
  onAddCategory: (programId: string) => void
  onAddSubjectInCate?: (category: {
    id: string
    level: 1 | 2 | 3
    idCate1?: string
    idCate2?: string
    idCate3?: string
  }) => void
  mutate: KeyedMutator<any>
}

const ProgramRow: React.FC<ProgramRowProps> = ({ program, onAddCategory, onAddSubjectInCate, mutate }) => {
  const { settings } = useSettings()
  const { toogleUpdateCategory1, setProgramId } = useTrainingProgramStore()
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const handleOpenUpdateCate1 = useCallback(
    (id: string) => {
      toogleUpdateCategory1()
      setProgramId(id)
      setOpenUpdateModal(true)
    },
    [setProgramId, toogleUpdateCategory1]
  )

  const handleCloseUpdateModal = useCallback(() => {
    setOpenUpdateModal(false)
  }, [])

  const handleOpenDeleteModal = useCallback(() => {
    setOpenDeleteModal(true)
  }, [])

  const handleCloseDeleteModal = useCallback(() => {
    setOpenDeleteModal(false)
  }, [])

  return (
    <>
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
            <IconButton
              size='small'
              onClick={() =>
                onAddSubjectInCate?.({
                  id: program._id,
                  level: 1,
                  idCate1: program._id,
                  idCate2: undefined,
                  idCate3: undefined
                })
              }
            >
              <SubjectIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Thêm danh mục cấp 2'>
            <IconButton size='small' onClick={() => onAddCategory(program._id)}>
              <CategoryIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Cập nhật danh mục'>
            <IconButton size='small' onClick={() => handleOpenUpdateCate1(program._id)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title='Xóa danh mục'>
            <IconButton size='small' onClick={handleOpenDeleteModal}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <UpdateCategory1Modal
        open={openUpdateModal}
        onClose={handleCloseUpdateModal}
        mutate={mutate}
        programId={program._id}
        category={program}
      />

      <DeleteCategoryModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        mutate={mutate}
        programId={program._id}
        categoryId={program._id}
        level={1}
      />
    </>
  )
}

export default ProgramRow
