'use client'

import { MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableSortLabel } from '@mui/material'

import StyledTableRow from '@/components/table/StyledTableRow'
import type { Class } from '@/types/management/classType'
import RowAction from '@/components/rowAction'
import Iconify from '@/components/iconify'
import TableLoading from '@/components/table/TableLoading'
import TableNoData from '@/components/table/TableNotFound'
import { useClassStore } from '@/stores/class/class'

type ClassListProps = {
  classes: Class[] | undefined
  page: number
  limit: number
  loading: boolean
  total: number
  sortField?: string
  sortOrder?: string
  handleSort: (field: string) => void
}

export default function ClassList({
  classes,
  total,
  loading,
  page,
  limit,
  sortField,
  sortOrder,
  handleSort
}: ClassListProps) {
  const {
    toogleOpenEditClassModal,
    toogleOpenDeleteClassModal,

    // toogleOpenViewDetailModal,
    setClass,
    toogleOpenViewListStudentModal
  } = useClassStore()

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
                Mã lớp
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'cohortId'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('cohortId')}
              >
                Khóa
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === 'lectureId'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('lectureId')}
              >
                Người phụ trách
              </TableSortLabel>
            </TableCell>
            <TableCell colSpan={2}>
              <TableSortLabel
                active={sortField === 'numberStudent'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('numberStudent')}
              >
                Số lượng sinh viên
              </TableSortLabel>
            </TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {classes?.map((c, index) => {
            const stt = (page - 1) * limit + index + 1

            return (
              <StyledTableRow key={c._id}>
                <TableCell size='small'>{stt}</TableCell>
                <TableCell size='small'>{c.classId}</TableCell>
                <TableCell size='small'>{c.cohortId?.cohortId}</TableCell>
                <TableCell size='small'>
                  {c?.userName} - {c?.userId}
                </TableCell>
                <TableCell size='small'>{c.numberStudent}</TableCell>
                <TableCell width={1} size='small'>
                  <RowAction>
                    {/* <MenuItem
                      onClick={() => {
                        setClass(c)
                        toogleOpenViewDetailModal()
                      }}
                    >
                      <Iconify icon='solar:eye-linear' className='mr-2' />
                      Xem chi tiết
                    </MenuItem> */}
                    <MenuItem
                      onClick={() => {
                        setClass(c)
                        toogleOpenViewListStudentModal()
                      }}
                    >
                      <Iconify icon='garden:user-list-stroke-16' className='mr-2' />
                      Danh sách sinh viên
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setClass(c)
                        toogleOpenEditClassModal()
                      }}
                    >
                      <Iconify icon='eva:edit-2-outline' className='mr-2' />
                      Sửa
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setClass(c)
                        toogleOpenDeleteClassModal()
                      }}
                    >
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
            <TableNoData notFound={total === 0} title='Không tìm thấy sinh viên nào' />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
