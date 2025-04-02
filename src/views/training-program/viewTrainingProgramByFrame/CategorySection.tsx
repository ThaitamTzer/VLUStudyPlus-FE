import React from 'react'

import { IconButton, TableCell, TableRow, Tooltip } from '@mui/material'
import SubjectIcon from '@mui/icons-material/Book'
import CategoryIcon from '@mui/icons-material/Folder'

import { useSettings } from '@/@core/hooks/useSettings'
import type { Categories } from '@/types/management/trainningProgramType'

interface CategorySectionProps {
  category: Categories
  level: number
  onAddCategory: (parentId: string) => void
  onAddSubject: (categoryId: string) => void
}

const CategorySection: React.FC<CategorySectionProps> = ({ category, level, onAddCategory, onAddSubject }) => {
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
          <Tooltip title='Thêm môn học'>
            <IconButton size='small' onClick={() => onAddSubject(category._id)} sx={{ mr: 1 }}>
              <SubjectIcon fontSize='small' />
            </IconButton>
          </Tooltip>

          {canAddSubcategory && (
            <Tooltip title='Thêm danh mục con'>
              <IconButton size='small' onClick={() => onAddCategory(category._id)}>
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
