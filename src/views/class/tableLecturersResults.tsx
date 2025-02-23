import { Table, TableBody, TableCell, TableContainer, TableHead } from '@mui/material'

import StyledTableRow from '@/components/table/StyledTableRow'
import type { ImportLecturer } from '@/types/management/classType'

export default function TableLecturesResults({ importResultData }: { importResultData: ImportLecturer[] }) {
  if (importResultData.length === 0) {
    return null
  }

  console.log(importResultData)

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
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {importResultData.map((row, index) => (
            <StyledTableRow key={index}>
              <TableCell size='small'>{index + 1}</TableCell>
              <TableCell size='small'>{row?.userId}</TableCell>
              <TableCell size='small'>{row?.userName}</TableCell>
              <TableCell size='small'>{row?.mail}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
