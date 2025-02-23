import { Table, TableBody, TableCell, TableContainer, TableHead, Typography } from '@mui/material'

import type { MissingError } from '@/types/management/classType'
import StyledTableRow from '@/components/table/StyledTableRow'

export default function TableMissing({ missingInfoRows }: { missingInfoRows: MissingError[] }) {
  if (missingInfoRows.length === 0) {
    return (
      <Typography variant='h3' color='textSecondary'>
        Không có lỗi nào
      </Typography>
    )
  }

  return (
    <TableContainer
      sx={{ position: 'relative', overflowX: 'auto', maxHeight: 'calc(100vh - 300px)', border: '1px solid #000' }}
    >
      <Table stickyHeader sx={{ minWidth: 1000 }}>
        <TableHead>
          <StyledTableRow>
            <TableCell>STT</TableCell>
            <TableCell>THÔNG BÁO LỖI</TableCell>
            <TableCell>MÃ GIẢNG VIÊN</TableCell>
            <TableCell>TÊN GIẢNG VIÊN</TableCell>
            <TableCell>MAIL</TableCell>
            <TableCell>SỐ LƯỢNG SINH VIÊN</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {missingInfoRows.map((row, index) => (
            <StyledTableRow key={index}>
              <TableCell size='small'>
                {row.stt ? (
                  <>
                    STT {row.stt} (dòng {row.row})
                  </>
                ) : (
                  <>dòng {row.row}</>
                )}
              </TableCell>
              <TableCell size='small'>
                {row.message}
                {row.details.cohortId && <p className='text-red-600'>{row.details.cohortId}</p>}
              </TableCell>
              <TableCell size='small'>
                {row.details.userId || <p className='text-red-600'>Không có mã giảng viên</p>}
              </TableCell>
              <TableCell size='small'>
                {row.details.userName || <p className='text-red-600'>Không có họ và tên</p>}
              </TableCell>
              <TableCell size='small'>
                {row.details.userEmail || <p className='text-red-600'>Không có mail</p>}
              </TableCell>
              <TableCell size='small'>
                {row.details.numberStudents || <p className='text-red-600'>Không có số lượng sinh viên</p>}
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
