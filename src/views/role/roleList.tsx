'use client'

import { Table, TableBody, TableCell, TableContainer, TableHead } from '@mui/material'

import type { Role } from '@/types/management/roleType'
import { TagPermissionNames } from '@/components/tagpermission'
import TableNoData from '@/components/table/TableNotFound'
import RowAction from './rowAction'
import StyledTableRow from '@/components/table/StyledTableRow'

type RoleListProps = {
  roles: Role[]
  page: number
  limit: number
  total: number
}

export default function RoleList(props: RoleListProps) {
  const { roles, page, limit, total } = props

  const notFound = total === 0

  return (
    <TableContainer sx={{ position: 'relative', overflowX: 'auto' }}>
      <Table stickyHeader sx={{ minWidth: 800 }}>
        <TableHead>
          <StyledTableRow
            sx={{
              textTransform: 'uppercase'
            }}
          >
            <TableCell width={1}>STT</TableCell>
            <TableCell>Tên vai trò</TableCell>
            <TableCell colSpan={2}>Quyền hạn</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {roles.map((row, index) => {
            const stt = (page - 1) * limit + index + 1

            return (
              <StyledTableRow key={row._id}>
                <TableCell size='small'>{stt}</TableCell>
                <TableCell size='small'>{row.name}</TableCell>
                <TableCell size='small'>
                  <TagPermissionNames data={row} />
                </TableCell>
                <TableCell size='small' align='right'>
                  <RowAction role={row} />
                </TableCell>
              </StyledTableRow>
            )
          })}
        </TableBody>
        <TableNoData notFound={notFound} title='Không tìm thấy vai trò nào' />
      </Table>
    </TableContainer>
  )
}
