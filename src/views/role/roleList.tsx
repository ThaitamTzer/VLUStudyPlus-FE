import { styled, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'

import type { Role } from '@/types/management/roleType'
import { TagPermissionNames } from '@/components/tagpermission'
import { emptyRows } from '@/components/table/utils'
import TableEmptyRows from '@/components/table/TableEmptyRows'
import TableNoData from '@/components/table/TableNotFound'

type RoleListProps = {
  roles: Role[]
  page: number
  limit: number
  total: number
  pagination?: React.ReactNode
}

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.palette.action.hover
  },

  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0
  }
}))

export default function RoleList(props: RoleListProps) {
  const { roles, page, limit, total, pagination } = props

  const notFound = total === 0

  return (
    <TableContainer sx={{ position: 'relative', overflowX: 'auto' }}>
      <Table stickyHeader sx={{ minWidth: 800 }}>
        <TableHead>
          <StyledTableRow>
            <TableCell>STT</TableCell>
            <TableCell>Tên vai trò</TableCell>
            <TableCell colSpan={2}>Quyền hạn</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {roles.map((row, index) => {
            const stt = (page - 1) * limit + index + 1

            return (
              <StyledTableRow key={row._id}>
                <TableCell>{stt}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>
                  <TagPermissionNames data={row} />
                </TableCell>
                <TableCell align='right'>{/* <RowAction role={row} /> */}</TableCell>
              </StyledTableRow>
            )
          })}
          <TableEmptyRows emptyRows={emptyRows(page, limit, roles.length)} />
          <TableNoData notFound={notFound} title='Không tìm thấy người dùng nào' />
        </TableBody>
      </Table>
    </TableContainer>
  )
}
