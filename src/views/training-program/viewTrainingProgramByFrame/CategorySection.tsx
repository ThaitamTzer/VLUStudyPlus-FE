import React, { useState } from 'react'

import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material'
import SubjectIcon from '@mui/icons-material/Book'
import CategoryIcon from '@mui/icons-material/Folder'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import type { KeyedMutator } from 'swr'

import type { Categories } from '@/types/management/trainningProgramType'
import UpdateCategoryForm from './UpdateCategoryForm'
import DeleteCategoryModal from './DeleteCategoryModal'

interface CategorySectionProps {
  category: Categories
  level: number
  onAddCategory: (parentId: string, idCate1: string) => void
  onAddSubject: (categoryId: string) => void
  onAddSubjectInCate?: (category: {
    id: string
    level: 1 | 2 | 3
    idCate1?: string
    idCate2?: string
    idCate3?: string
  }) => void
  idCate1: string
  idCate2: string
  idCate3: string
  mutate: KeyedMutator<any>
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  level,
  onAddCategory,
  onAddSubject,
  onAddSubjectInCate,
  idCate1,
  idCate2,
  idCate3,
  mutate
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [openDeleteModal, setOpenDeleteModal] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleOpenDeleteModal = () => {
    setOpenDeleteModal(true)
  }

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false)
  }

  const handleAddSubjectInCate = () => {
    if (onAddSubjectInCate) {
      onAddSubjectInCate({
        id: category._id,
        level: level as 1 | 2 | 3,
        idCate1,
        idCate2: level > 1 ? idCate2 : undefined,
        idCate3: level === 3 ? idCate3 : undefined
      })
    } else {
      // Fallback to old method if onAddSubjectInCate is not provided
      onAddSubject(category._id)
    }
  }

  if (isEditing) {
    return (
      <UpdateCategoryForm
        category={category}
        level={level}
        onCancel={handleCancel}
        mutate={mutate}
        idCate1={idCate1}
        idCate2={level > 1 ? idCate2 : undefined}
        idCate3={level === 3 ? idCate3 : undefined}
      />
    )
  }

  return (
    <>
      <TableRow>
        <TableCell
          sx={{
            paddingLeft: `${level * 9}px`,
            backgroundColor: '#578FCA7a'
          }}
        >
          <div className='flex items-center gap-2'>
            <span>{category.titleN}</span>
            <span>{category.titleV}</span>
          </div>
        </TableCell>
        <TableCell align='right' sx={{ backgroundColor: '#578FCA7a' }}>
          {category.credits}
        </TableCell>
        <TableCell colSpan={8} align='right' sx={{ backgroundColor: '#578FCA7a' }}>
          <Tooltip title='Thêm môn học'>
            <IconButton size='small' onClick={handleAddSubjectInCate}>
              <SubjectIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          {level < 3 && (
            <Tooltip title={`Thêm danh mục cấp ${level + 1}`}>
              <IconButton size='small' onClick={() => onAddCategory(category._id, idCate1)}>
                <CategoryIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title='Chỉnh sửa'>
            <IconButton size='small' onClick={handleEdit}>
              <EditIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Xóa'>
            <IconButton size='small' onClick={handleOpenDeleteModal}>
              <DeleteIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      <DeleteCategoryModal
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        mutate={mutate}
        programId={idCate1}
        categoryId={category._id}
        level={level}
        parentId={level === 3 ? idCate2 : undefined}
      />
    </>
  )
}

export default CategorySection
