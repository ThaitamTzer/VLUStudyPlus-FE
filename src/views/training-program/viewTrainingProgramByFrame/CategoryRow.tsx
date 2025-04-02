import { IconButton, TableCell, TableRow, TextField } from '@mui/material'

import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

import type { Categories } from '@/types/management/trainningProgramType'
import { useSettings } from '@/@core/hooks/useSettings'

interface CategoryRowProps {
  category: Categories
  level: number
  isEditing?: boolean
  onChange?: (field: keyof Categories, value: any) => void
  onSave?: () => void
  onCancel?: () => void
}

const CategoryRow: React.FC<CategoryRowProps> = ({ category, level, isEditing, onChange, onSave, onCancel }) => {
  const { settings } = useSettings()

  if (isEditing) {
    return (
      <TableRow>
        <TableCell
          sx={{
            paddingLeft: `${level * 9}px`,
            backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a'
          }}
        >
          <TextField
            size='small'
            value={category.titleN}
            onChange={e => onChange?.('titleN', e.target.value)}
            placeholder='Số TT danh mục'
            sx={{ mr: 2, mb: 1 }}
          />
          <TextField
            size='small'
            value={category.titleV}
            onChange={e => onChange?.('titleV', e.target.value)}
            placeholder='Tên danh mục'
            sx={{ mr: 2 }}
          />
        </TableCell>
        <TableCell
          sx={{
            backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a',
            textAlign: 'right'
          }}
          width={100}
          align='right'
        >
          <TextField
            size='small'
            type='number'
            value={category.credits}
            onChange={e => onChange?.('credits', Number(e.target.value))}
            placeholder='Tín chỉ'
          />
        </TableCell>
        <TableCell
          colSpan={8}
          sx={{
            backgroundColor: settings.mode === 'dark' ? '#7A73D1' : '#578FCA7a',
            textAlign: 'right'
          }}
        >
          <IconButton size='small' onClick={onSave} color='primary'>
            <SaveIcon fontSize='small' />
          </IconButton>
          <IconButton size='small' onClick={onCancel} color='error'>
            <CancelIcon fontSize='small' />
          </IconButton>
        </TableCell>
      </TableRow>
    )
  }

  return null // The regular category display is handled by CategorySection
}

export default CategoryRow
