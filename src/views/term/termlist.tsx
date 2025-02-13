import { Table, TableBody, TableCell, TableContainer, TableHead } from '@mui/material'

import TableNoData from '@/components/table/TableNotFound'
import StyledTableRow from '@/components/table/StyledTableRow'
import { fDate } from '@/utils/format-time'
import type { Term } from '@/types/management/termType'
import RowAction from './rowAction'
import TableLoading from '@/components/table/TableLoading'

type TermListProps = {
  terms: Term[]
  total: number
  loading?: boolean
}

export default function TermList(props: TermListProps) {
  const { terms, total, loading } = props

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
          <StyledTableRow
            sx={{
              textTransform: 'uppercase'
            }}
          >
            <TableCell>Tên học kỳ</TableCell>
            <TableCell>Số lượng học phần</TableCell>
            <TableCell>Ngày bắt đầu</TableCell>
            <TableCell colSpan={2}>Ngày kết thúc</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {terms.map(row => {
            return (
              <StyledTableRow key={row._id}>
                <TableCell size='small'>{row.termName}</TableCell>
                <TableCell size='small'>{row.maxCourse}</TableCell>
                <TableCell size='small'>{fDate(row.startDate, 'dd/MM/yyyy')}</TableCell>
                <TableCell size='small'>{fDate(row.endDate, 'dd/MM/yyyy')}</TableCell>
                <TableCell size='small' align='right'>
                  <RowAction term={row} />
                </TableCell>
              </StyledTableRow>
            )
          })}
        </TableBody>
        {loading && total === 0 ? (
          <TableLoading colSpan={12} />
        ) : (
          <TableNoData notFound={total === 0} title='Không tìm thấy sinh viên nào' />
        )}
      </Table>
    </TableContainer>
  )
}
