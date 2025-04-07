'use client'
import { FormControl, IconButton, MenuItem, Select, Stack, TableCell, TextField, Tooltip } from '@mui/material'

import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'

import Iconify from '@/components/iconify'
import type { Subjects } from '@/types/management/trainningProgramType'
import StyledTableRow from '@/components/table/StyledTableRow'

interface SubjectRowProps {
  subject: Subjects
  level: number
  isEditing?: boolean
  onChange?: (field: keyof Subjects, value: any) => void
  onSave?: () => void
  onCancel?: () => void
}

const SubjectRow: React.FC<SubjectRowProps> = ({ subject, level, isEditing, onChange, onSave, onCancel }) => {
  if (isEditing) {
    return (
      <StyledTableRow>
        <TableCell sx={{ paddingLeft: `${level * 9}px` }}>
          <Stack direction='row' spacing={1}>
            <TextField
              size='small'
              value={subject.courseCode}
              onChange={e => onChange?.('courseCode', e.target.value)}
              placeholder='Mã môn học'
              sx={{ mb: 1 }}
            />
            <TextField
              size='small'
              value={subject.courseName}
              onChange={e => onChange?.('courseName', e.target.value)}
              placeholder='Tên môn học'
            />
          </Stack>
        </TableCell>
        <TableCell align='right'>
          <TextField
            size='small'
            type='number'
            value={subject.credits}
            onChange={e => onChange?.('credits', Number(e.target.value))}
            fullWidth
          />
        </TableCell>
        <TableCell align='right'>
          <TextField
            size='small'
            type='number'
            value={subject.LT}
            onChange={e => onChange?.('LT', Number(e.target.value))}
            fullWidth
          />
        </TableCell>
        <TableCell align='right'>
          <TextField
            size='small'
            type='number'
            value={subject.TH}
            onChange={e => onChange?.('TH', Number(e.target.value))}
            fullWidth
          />
        </TableCell>
        <TableCell align='right'>
          <TextField
            size='small'
            type='number'
            value={subject.TT}
            onChange={e => onChange?.('TT', Number(e.target.value))}
            fullWidth
          />
        </TableCell>
        <TableCell>
          <FormControl fullWidth size='small'>
            <Select value={subject.isRequire} onChange={e => onChange?.('isRequire', e.target.value)}>
              <MenuItem value='true'>Bắt buộc</MenuItem>
              <MenuItem value='false'>Tự chọn</MenuItem>
            </Select>
          </FormControl>
        </TableCell>
        <TableCell>
          <TextField
            size='small'
            value={subject.prerequisites}
            onChange={e => onChange?.('prerequisites', e.target.value)}
            fullWidth
          />
        </TableCell>
        <TableCell>
          <TextField
            size='small'
            value={subject.preConditions}
            onChange={e => onChange?.('preConditions', e.target.value)}
            fullWidth
          />
        </TableCell>
        <TableCell>
          <TextField
            size='small'
            value={subject.implementationSemester}
            onChange={e => onChange?.('implementationSemester', e.target.value)}
            fullWidth
          />
        </TableCell>
        <TableCell>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <IconButton size='small' onClick={onSave} color='primary'>
              <SaveIcon fontSize='small' />
            </IconButton>
            <IconButton size='small' onClick={onCancel} color='error'>
              <CancelIcon fontSize='small' />
            </IconButton>
          </div>
        </TableCell>
      </StyledTableRow>
    )
  }

  return (
    <StyledTableRow>
      <TableCell sx={{ paddingLeft: `${level * 9}px` }}>
        {subject.courseCode} - {subject.courseName}
      </TableCell>
      <TableCell align='right'>{subject.credits}</TableCell>
      <TableCell align='right'>{subject.LT}</TableCell>
      <TableCell align='right'>{subject.TH}</TableCell>
      <TableCell align='right'>{subject.TT}</TableCell>
      <TableCell>{subject.isRequire ? 'Bắt buộc' : 'Tự chọn'}</TableCell>
      <TableCell>{subject.prerequisites}</TableCell>
      <TableCell>{subject.preConditions}</TableCell>
      <TableCell>{subject.implementationSemester}</TableCell>
      <TableCell>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title='Cập nhật môn học' arrow>
            <IconButton size='small' color='primary'>
              <Iconify icon='eva:edit-fill' />
            </IconButton>
          </Tooltip>
          <Tooltip title='Xóa môn học' arrow>
            <IconButton size='small' color='error'>
              <Iconify icon='eva:trash-2-outline' />
            </IconButton>
          </Tooltip>
        </div>
      </TableCell>
    </StyledTableRow>
  )
}

export default SubjectRow
