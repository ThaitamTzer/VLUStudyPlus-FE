import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

import type { MissingInfoRows } from '@/types/management/lecturerType'

export default function TableLecturersMissing({ missingInfoRows }: { missingInfoRows: MissingInfoRows[] }) {
  if (missingInfoRows.length === 0) {
    return (
      <Typography variant='h3' color='textSecondary'>
        Không có giảng viên nào bị lỗi
      </Typography>
    )
  }

  console.log(missingInfoRows)

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
            <TableCell>Tên giảng viên</TableCell>
            <TableCell>Mail</TableCell>
            <TableCell>Vai trò</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {missingInfoRows.map((row, index) => (
            <TableRow key={index}>
              <TableCell size='small'>Dòng thứ {row.row} trong file Excel</TableCell>
              <TableCell size='small'>{row.message}</TableCell>
              <TableCell size='small'>
                {row.details.maGV || <p className='text-red-600'>Không có thông tin</p>}
              </TableCell>
              <TableCell size='small'>
                {row.details.hoVaTen || <p className='text-red-600'>Không có thông tin</p>}
              </TableCell>
              <TableCell size='small'>
                {row.details.mail || <p className='text-red-600'>Không có thông tin</p>}
              </TableCell>
              <TableCell size='small'>
                {row.details.vaiTro || <p className='text-red-600'>Không có thông tin</p>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
