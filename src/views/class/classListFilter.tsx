'use client'

import { MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableSortLabel } from '@mui/material'

import StyledTableRow from '@/components/table/StyledTableRow'
import type { ClassGroupByLecturer } from '@/types/management/classType'
import RowAction from '@/components/rowAction'
import Iconify from '@/components/iconify'
import TableLoading from '@/components/table/TableLoading'
import TableNoData from '@/components/table/TableNotFound'
import { useClassStore } from '@/stores/class/class'

type ClassListProps = {
  data: ClassGroupByLecturer[] | undefined
  page: number
  limit: number
  loading: boolean
  total: number
  sortField?: string
  sortOrder?: string
  handleSort: (field: string) => void
}

export default function ClassListFilter({
  data,
  total,
  loading,
  page,
  limit,
  sortField,
  sortOrder,
  handleSort
}: ClassListProps) {
  const {} = useClassStore()

  return (
    <TableContainer sx={{ position: 'relative', overflowX: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
      <Table stickyHeader sx={{ minWidth: 1100 }}>
        <TableHead>
          <StyledTableRow sx={{ textTransform: 'uppercase' }}>
            <TableCell width='1px'>STT</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'classId'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('classId')}
              >
                Mã giảng viên
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'cohortId'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('cohortId')}
              >
                Tên giảng viên
              </TableSortLabel>
            </TableCell>
            <TableCell colSpan={2}>Các lớp niên chế </TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {data?.map((lecturer, index) => {
            const stt = (page - 1) * limit + index + 1

            return (
              <StyledTableRow key={lecturer.lectureId._id}>
                <TableCell size='small'>{stt}</TableCell>
                <TableCell size='small'>{lecturer.lectureId.userId}</TableCell>
                <TableCell size='small'>{lecturer.lectureId.userName}</TableCell>
                <TableCell size='small'>{lecturer.lectureId.classes.map(c => c.classId).join(', ')}</TableCell>
                <TableCell width={1} size='small'>
                  <RowAction>
                    <MenuItem>
                      <Iconify icon='solar:eye-linear' className='mr-2' />
                      Xem chi tiết
                    </MenuItem>
                    <MenuItem>
                      <Iconify icon='eva:edit-2-outline' className='mr-2' />
                      Sửa
                    </MenuItem>
                    <MenuItem>
                      <Iconify icon='eva:trash-2-outline' className='mr-2' />
                      Xóa
                    </MenuItem>
                  </RowAction>
                </TableCell>
              </StyledTableRow>
            )
          })}
          {loading && total === 0 ? (
            <TableLoading colSpan={12} />
          ) : (
            <TableNoData notFound={total === 0} title='Không tìm lớp nào' />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
