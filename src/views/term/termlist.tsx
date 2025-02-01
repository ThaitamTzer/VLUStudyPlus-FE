import { Table, TableBody, TableCell, TableContainer, TableHead } from '@mui/material'

import TableNoData from '@/components/table/TableNotFound'
import StyledTableRow from '@/components/table/StyledTableRow'
import { fDate } from '@/utils/format-time'
import type { Term } from '@/types/management/termType'
import RowAction from './rowAction'

type TermListProps = {
  terms: Term[]
  total: number
}

export default function TermList(props: TermListProps) {
  const { terms, total } = props

  return (
    <TableContainer
      sx={{
        position: 'relative',
        overflowX: 'auto',
        maxHeight: 'calc(100vh - 300px)'
      }}
    >
      <Table
        stickyHeader
        sx={{
          minWidth: 800
        }}
      >
        <TableHead>
          <StyledTableRow>
            <TableCell>Tên học kỳ</TableCell>
            <TableCell>Năm học</TableCell>
            <TableCell>Ngày bắt đầu</TableCell>
            <TableCell colSpan={2}>Ngày kết thúc</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {terms.map(row => {
            return (
              <StyledTableRow key={row._id}>
                <TableCell>{row.termName}</TableCell>
                <TableCell>{row.academicYear}</TableCell>
                <TableCell>{fDate(row.startDate, 'dd/MM/yyyy')}</TableCell>
                <TableCell>{fDate(row.endDate, 'dd/MM/yyyy')}</TableCell>
                <TableCell align='right'>
                  <RowAction term={row} />
                </TableCell>
              </StyledTableRow>
            )
          })}
          <TableNoData notFound={total === 0} title='Không tìm thấy học kỳ nào' />
        </TableBody>
      </Table>
    </TableContainer>
  )
}
