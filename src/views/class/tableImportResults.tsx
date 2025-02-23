import { Table, TableBody, TableCell, TableContainer, TableHead } from '@mui/material'

import StyledTableRow from '@/components/table/StyledTableRow'
import type { ImportSuccess } from '@/types/management/classType'

export default function TableImportResults({ importResultData }: { importResultData: ImportSuccess[] }) {
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
            <TableCell>Tổng số sinh viên</TableCell>
            <TableCell>Mã giảng viên</TableCell>
            <TableCell>Giảng viên phụ trách</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {importResultData.map((row, index) => (
            <StyledTableRow key={index}>
              <TableCell size='small'>{index + 1}</TableCell>
              <TableCell size='small'>{row?.classId}</TableCell>
              <TableCell size='small'>{row?.numberStudent}</TableCell>
              <TableCell size='small'>{row?.userId}</TableCell>
              <TableCell size='small'>{row?.userName}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
