import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

import type { DuplicateRows } from '@/types/management/lecturerType'

export default function TableLecturersDuplicate({ duplicateRows }: { duplicateRows: DuplicateRows[] }) {
  if (duplicateRows.length === 0) {
    return (
      <Typography variant='h3' color='textSecondary'>
        Không có giảng viên nào bị trùng lặp
      </Typography>
    )
  }

  console.log(duplicateRows)

  return (
    <TableContainer
      sx={{ position: 'relative', overflowX: 'auto', maxHeight: 'calc(100vh - 300px)', border: '1px solid #000' }}
    >
      <Table stickyHeader sx={{ minWidth: 1000 }}>
        <TableHead>
          <TableRow>
            <TableCell>Dòng</TableCell>
            <TableCell>Thông báo lỗi</TableCell>
            <TableCell>Mã giảng viên</TableCell>
            <TableCell>Mail</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {duplicateRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell size='small'>Dòng thứ {row.row} trong file Excel</TableCell>
              <TableCell size='small'>{row.message}</TableCell>
              <TableCell size='small'>
                {row.details.maGV || <p className='text-red-600'>Không có thông tin</p>}
              </TableCell>
              <TableCell size='small'>
                {row.details.mail || <p className='text-red-600'>Không có thông tin</p>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
