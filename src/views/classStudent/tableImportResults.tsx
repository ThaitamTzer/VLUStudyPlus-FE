import { Table, TableBody, TableCell, TableContainer, TableHead } from '@mui/material'

import StyledTableRow from '@/components/table/StyledTableRow'
import type { ImportedResult } from '@/types/management/classStudentType'

export default function TableImportResults({ importResultData }: { importResultData: ImportedResult[] }) {
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
            <TableCell>Mã lớp</TableCell>
            <TableCell>Mail</TableCell>
            <TableCell>Mã sinh viên</TableCell>
            <TableCell>Têm sinh viên</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {importResultData.map((row, index) => (
            <StyledTableRow key={index}>
              <TableCell size='small'>{index + 1}</TableCell>
              <TableCell size='small'>{row?.classCode}</TableCell>
              <TableCell size='small'>{row?.mail}</TableCell>
              <TableCell size='small'>{row?.userId}</TableCell>
              <TableCell size='small'>{row?.userName}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
