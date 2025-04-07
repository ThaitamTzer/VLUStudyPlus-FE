import React from 'react'

import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material'
import SubjectIcon from '@mui/icons-material/Book'
import CategoryIcon from '@mui/icons-material/Folder'
import EditIcon from '@mui/icons-material/Edit'

import { useSettings } from '@/@core/hooks/useSettings'
import type { Categories } from '@/types/management/trainningProgramType'

interface CategorySectionProps {
  category: Categories
  level: number
  onAddCategory: (parentId: string, idCate1: string) => void
  onAddSubject: (categoryId: string) => void
  onEditCategory?: (category: Categories, level: number) => void
  idCate1?: string
}

const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  level,
  onAddCategory,
  onAddSubject,
  onEditCategory,
  idCate1
}) => {
  const { settings } = useSettings()
  const canAddSubcategory = level < 3 // Only allow adding subcategories up to level 3

  return (
    <>
      {/* Header row for the category */}
      <TableRow>
        <TableCell
          colSpan={1}
          sx={{
            paddingLeft: `${level * 9}px`,
            fontWeight: 'bold',
            backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
          }}
        >
          {category.titleN} {category.titleV}
        </TableCell>
        <TableCell
          align='right'
          sx={{
            backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a',
            textAlign: 'right'
          }}
        >
          {category.credits}
        </TableCell>
        <TableCell
          colSpan={8}
          sx={{
            backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a',
            textAlign: 'right'
          }}
        >
          <Tooltip title='Sửa danh mục'>
            <IconButton size='small' onClick={() => onEditCategory?.(category, level)} sx={{ mr: 1 }}>
              <EditIcon fontSize='small' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Thêm môn học'>
            <IconButton size='small' onClick={() => onAddSubject(category._id)} sx={{ mr: 1 }}>
              <SubjectIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          {canAddSubcategory && (
            <Tooltip title={`Thêm danh mục cấp ${level + 1}`}>
              <IconButton size='small' onClick={() => onAddCategory(category._id, idCate1 || category._id)}>
                <CategoryIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
    </>
  )
}

export default CategorySection
