import { Table, TableBody, TableCell, TableContainer, TableHead, Typography } from '@mui/material'

import StyledTableRow from '@/components/table/StyledTableRow'
import type { MissingInforType } from '@/types/management/classStudentType'
import { fDate } from '@/utils/format-time'

export default function TableMissing({ missingInfoRows }: { missingInfoRows: MissingInforType[] }) {
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
          <StyledTableRow
            sx={{
              textTransform: 'uppercase'
            }}
          >
            <TableCell>STT</TableCell>
            <TableCell>THÔNG BÁO LỖI</TableCell>
            <TableCell>MÃ SINH VIÊN</TableCell>
            <TableCell>TÊN SINH VIÊN</TableCell>
            <TableCell>MAIL</TableCell>
            <TableCell>MÃ LỚP</TableCell>
            <TableCell>NGÀY SINH</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {missingInfoRows.map((row, index) => (
            <StyledTableRow key={index}>
              {row.details.userId ? (
                <>
                  <TableCell size='small'>
                    {row.sheet ? (
                      <>
                        Dòng <strong>{row.row}</strong> sheet <strong>{row.sheet}</strong>
                      </>
                    ) : (
                      <>Dòng {row.row}</>
                    )}
                  </TableCell>
                  <TableCell size='small'>{row.message}</TableCell>
                  <TableCell size='small'>
                    {row.details.userId || <p className='text-red-600'>Không có mã sinh viên</p>}
                  </TableCell>
                  <TableCell size='small'>
                    {row.details.userName || <p className='text-red-600'>Không có họ và tên</p>}
                  </TableCell>
                  <TableCell size='small'>
                    {row.details.mail || <p className='text-red-600'>Không có mail</p>}
                  </TableCell>
                  <TableCell size='small'>
                    {row.details.classCode || <p className='text-red-600'>Không có mã lớp</p>}
                  </TableCell>
                  <TableCell size='small'>
                    {fDate(row.details.dateOfBirth, 'dd/MM/yyyy') || <p className='text-red-600'>Không có ngày sinh</p>}
                  </TableCell>
                </>
              ) : (
                <TableCell colSpan={12}>Không tìm thấy mã sinh viên</TableCell>
              )}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
