import { useMemo } from 'react'

import { TableCell, TableHead } from '@mui/material'

import { useSettings } from '@/@core/hooks/useSettings'
import StyledTableRow from '@/components/table/StyledTableRow'

const TrainingProgramHeader = ({
  action,
  extendHeader
}: {
  action?: 'view' | 'edit'
  extendHeader?: React.ReactNode
}) => {
  const { settings } = useSettings()

  const renderAction = useMemo(() => {
    if (action === 'edit') {
      return (
        <TableCell width={200} sx={{ fontWeight: 'bold' }}>
          Hành động
        </TableCell>
      )
    }

    return null
  }, [action])

  return (
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
        {renderAction}
        {extendHeader}
      </StyledTableRow>
    </TableHead>
  )
}

export default TrainingProgramHeader
