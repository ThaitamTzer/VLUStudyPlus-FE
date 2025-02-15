import { Table, TableBody, TableCell, TableContainer, TableHead } from '@mui/material'

import StyledTableRow from '@/components/table/StyledTableRow'
import type { LecturerResult } from '@/types/management/lecturerType'

export default function TableLecturersResults({ lecturersResult }: { lecturersResult: LecturerResult[] }) {
  if (lecturersResult.length === 0) {
    return null
  }

  console.log(lecturersResult)

  return (
    <TableContainer
      sx={{ position: 'relative', overflowX: 'auto', maxHeight: 'calc(100vh - 300px)', border: '1px solid #000' }}
    >
      <Table stickyHeader sx={{ minWidth: 500 }}>
        <TableHead>
          <StyledTableRow>
            <TableCell>STT</TableCell>
            <TableCell>Mã giảng viên</TableCell>
            <TableCell>Tên giảng viên</TableCell>
            <TableCell>Mail</TableCell>
            <TableCell>Vai trò</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {lecturersResult.map((row, index) => (
            <StyledTableRow key={index}>
              <TableCell size='small'>{index + 1}</TableCell>
              <TableCell size='small'>{row?.userId}</TableCell>
              <TableCell size='small'>{row?.userName}</TableCell>
              <TableCell size='small'>{row?.mail}</TableCell>
              <TableCell size='small'>{row?.role}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
