import { Table, TableBody, TableCell, TableContainer, TableHead, Typography } from '@mui/material'

import type { ErrorImport } from '@/types/management/studentType'
import StyledTableRow from '@/components/table/StyledTableRow'
import { fDate } from '@/utils/format-time'

export default function TableStudentMissing({ missingInfoRows }: { missingInfoRows: ErrorImport[] }) {
  if (missingInfoRows.length === 0) {
    return (
      <Typography variant='h4' color='textSecondary'>
        Không có sinh viên nào bị lỗi
      </Typography>
    )
  }

  return (
    <TableContainer
      sx={{ position: 'relative', overflowX: 'auto', maxHeight: 'calc(100vh - 300px)', border: '1px solid #000' }}
    >
      <Table stickyHeader sx={{ minWidth: 1000 }}>
        <TableHead>
          <StyledTableRow
            sx={{
              textTransform: 'uppercase'
            }}
          >
            <TableCell>Stt</TableCell>
            <TableCell>Thông báo lỗi</TableCell>
            <TableCell>Mã sinh viên</TableCell>
            <TableCell>Tên sinh viên</TableCell>
            <TableCell>Mã lớp</TableCell>
            <TableCell>Mail</TableCell>
            <TableCell>Ngày sinh</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {missingInfoRows.map((row, index) => (
            <StyledTableRow key={index}>
              <TableCell size='small'>
                {row.sheet ? (
                  <>
                    (dòng <strong>{row.row}</strong>) - Sheet <strong>{row.sheet}</strong>
                  </>
                ) : (
                  <>dòng {row.row}</>
                )}
              </TableCell>
              <TableCell size='small'>{row.message}</TableCell>
              <TableCell size='small'>
                {row.details.userId || <p className='text-red-600'>Thiếu mã sinh viên</p>}
              </TableCell>
              <TableCell size='small'>
                {row.details.userName || <p className='text-red-600'>Thiếu họ và tên sinh viên</p>}
              </TableCell>
              <TableCell size='small'>
                {row.details.classCode || <p className='text-red-600'>Thiếu mã lớp</p>}
              </TableCell>
              <TableCell size='small'>{row.details.mail || <p className='text-red-600'>Thiếu mail</p>}</TableCell>
              <TableCell size='small'>
                {/* {fDate(row?.details?.rawDateOfBirth, 'dd/mm/yyyy') || <p className='text-red-600'>Thiếu ngày sinh</p>} */}
                {!row?.details?.dateOfBirth ? (
                  <p className='text-red-600'>Thiếu ngày sinh</p>
                ) : (
                  fDate(row?.details?.dateOfBirth, 'dd/MM/yyyy')
                )}
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
