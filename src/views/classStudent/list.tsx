import { useCallback } from 'react'

import { useRouter } from 'next/navigation'

import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Stack,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  TableSortLabel,
  TablePagination,
  Chip
} from '@mui/material'

import type { ClassStudentType } from '@/types/management/classStudentType'
import { fDate } from '@/utils/format-time'
import StyledTableRow from '@/components/table/StyledTableRow'
import TableLoading from '@/components/table/TableLoading'
import TableNoData from '@/components/table/TableNotFound'
import IsBlock from '../student/isBlock'
import Iconify from '@/components/iconify'
import { useClassStudentStore } from '@/stores/classStudent/classStudent.store'
import { useGradeStore } from '@/stores/grade/grade.store'
import TablePaginationCustom from '@/components/table/TablePagination'

type ClassStudentListProps = {
  data: ClassStudentType[] | undefined
  loading: boolean
  total: number
  page: number
  limit: number
  handleSort: (field: string) => void
  sortField?: string
  sortOrder?: string
  searchKey?: string
  classCode?: string
}

const UserInfor = (data: ClassStudentType) => {
  return (
    <Stack direction='row' spacing={2} alignItems='center'>
      <Avatar
        alt={data.userName}
        src={data.avatar}
        sx={{
          width: 35,
          height: 35
        }}
      >
        {data.userName}
      </Avatar>
      <Stack spacing={1}>
        {data.userId} - {data.userName} - {data.classCode}
        <Typography variant='caption'>{data.mail}</Typography>
      </Stack>
    </Stack>
  )
}

export default function ClassStudentList(props: ClassStudentListProps) {
  const { data, loading, total, limit, page, handleSort, sortField, sortOrder, searchKey, classCode } = props
  const { toogleUpdateStudent } = useClassStudentStore()
  const { toogleUpdateGrade, setStudent } = useGradeStore()

  const handleUpdateGrade = useCallback(
    (student: ClassStudentType) => {
      toogleUpdateGrade()
      setStudent(student)
    },
    [toogleUpdateGrade, setStudent]
  )

  const router = useRouter()

  return (
    <>
      <TableContainer sx={{ position: 'relative', overflowX: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
        <Table stickyHeader sx={{ minWidth: 1100 }}>
          <TableHead>
            <StyledTableRow
              sx={{
                textTransform: 'uppercase'
              }}
            >
              <TableCell>STT</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'userName'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('userName')}
                >
                  Thông tin sinh viên
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
                  active={sortField === 'dateOfBirth'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('dateOfBirth')}
                >
                  Ngày sinh
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'isActive'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('isActive')}
                >
                  Tình trạng học tập
                </TableSortLabel>
              </TableCell>
              <TableCell colSpan={2}>
                <TableSortLabel
                  active={sortField === 'isBlock'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('isBlock')}
                >
                  Tài khoản
                </TableSortLabel>
              </TableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data?.map((student, index) => {
              const stt = (page - 1) * limit + index + 1

              return (
                <StyledTableRow key={student._id}>
                  <TableCell size='small' width={10}>
                    {stt}
                  </TableCell>
                  <TableCell size='small'>{UserInfor(student)}</TableCell>
                  <TableCell size='small'>{student.cohortId}</TableCell>
                  <TableCell size='small'>{fDate(student.dateOfBirth, 'dd/MM/yyyy')}</TableCell>
                  <TableCell size='small'>
                    {!student.isActive ? (
                      <Chip label='Còn học' color='success' size='small' />
                    ) : (
                      <Chip label='Nghỉ học' color='error' size='small' />
                    )}
                  </TableCell>
                  <TableCell size='small'>
                    <IsBlock isBlock={student.isBlock} />
                  </TableCell>
                  <TableCell size='small' align='right'>
                    {/* <Tooltip title='Xem chi tiết'>
                    <IconButton size='small'>
                      <Iconify icon='solar:eye-linear' />
                    </IconButton>
                  </Tooltip> */}
                    <Tooltip title='Cập nhật điểm'>
                      <IconButton size='medium' onClick={() => handleUpdateGrade(student)}>
                        <Iconify icon='flowbite:edit-solid' style={{ color: '#129990' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Chỉnh sửa thông tin' onClick={() => toogleUpdateStudent(student)}>
                      <IconButton size='medium'>
                        <Iconify icon='mdi:account-edit' style={{ color: '#FF9B45' }} />
                      </IconButton>
                    </Tooltip>
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
      <TablePagination
        component={() => (
          <TablePaginationCustom
            data={data || []}
            page={page}
            limit={limit}
            total={total || 0}
            sortField={sortField}
            sortOrder={sortOrder}
            searchKey={searchKey}
            classCode={classCode}
          />
        )}
        count={total || 0}
        page={page - 1}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 25, 50]}
        onPageChange={(_, newPage) => {
          const params = new URLSearchParams()

          if (classCode) {
            params.set('classCode', classCode)
          }

          params.set('page', (newPage + 1).toString())
          params.set('limit', limit.toString())

          if (sortField) {
            params.set('sortField', sortField)
          }

          if (sortOrder) {
            params.set('sortOrder', sortOrder)
          }

          if (searchKey) {
            params.set('searchKey', searchKey)
          }

          router.replace(`?${params.toString()}`, {
            scroll: false
          })
        }}
      />
    </>
  )
}
