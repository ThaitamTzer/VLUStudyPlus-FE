import React, { useState } from 'react'

import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material'
import SubjectIcon from '@mui/icons-material/Book'
import CategoryIcon from '@mui/icons-material/Folder'
import EditIcon from '@mui/icons-material/Edit'

import type { KeyedMutator } from 'swr'

import type { Categories } from '@/types/management/trainningProgramType'
import UpdateCategoryForm from './UpdateCategoryForm'

interface CategorySectionProps {
  category: Categories
  level: number
  onAddCategory: (parentId: string, idCate1: string) => void
  onAddSubject: (categoryId: string) => void
  idCate1?: string
  mutate: KeyedMutator<any>
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  level,
  onAddCategory,
  onAddSubject,
  idCate1,
  mutate
}) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <UpdateCategoryForm
        category={category}
        level={level}
        onCancel={handleCancel}
        mutate={mutate}
        idCate1={idCate1 || ''}
        idCate2={level > 1 ? category._id : undefined}
      />
    )
  }

  return (
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
          <IconButton size='small' onClick={() => onAddSubject(category._id)}>
            <SubjectIcon fontSize='small' />
          </IconButton>
        </Tooltip>
        {level < 3 && (
          <Tooltip title={`Thêm danh mục cấp ${level + 1}`}>
            <IconButton size='small' onClick={() => onAddCategory(category._id, idCate1 || '')}>
              <CategoryIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title='Chỉnh sửa'>
          <IconButton size='small' onClick={handleEdit}>
            <EditIcon fontSize='small' />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}

export default CategorySection
