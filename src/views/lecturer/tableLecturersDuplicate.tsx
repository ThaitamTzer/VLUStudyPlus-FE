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
          <TableRow sx={{ textTransform: 'uppercase' }}>
            <TableCell>Dòng</TableCell>
            <TableCell>Thông báo lỗi</TableCell>
            <TableCell>Mã giảng viên</TableCell>
            <TableCell>Mail</TableCell>
            <TableCell>Họ và tên</TableCell>
            <TableCell>Vai trò</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {duplicateRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell size='small'>
                {row.stt ? (
                  <>
                    STT {row.stt} (dòng {row.row})
                  </>
                ) : (
                  <>dòng {row.row}</>
                )}
              </TableCell>
              <TableCell size='small'>{row.message}</TableCell>
              <TableCell size='small'>
                {row.details.maGV || <p className='text-red-600'>Không có mã giảng viên</p>}
              </TableCell>
              <TableCell size='small'>{row.details.mail || <p className='text-red-600'>Không có mail</p>}</TableCell>
              <TableCell size='small'>
                {row.details.hoVaTen || <p className='text-red-600'>Không có họ và tên</p>}
              </TableCell>
              <TableCell size='small'>
                {row.details.vaiTro || <p className='text-red-600'>Không có vai trò</p>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
