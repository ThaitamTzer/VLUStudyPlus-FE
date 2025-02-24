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
  TableSortLabel
} from '@mui/material'

import type { ClassStudentType } from '@/types/management/classStudentType'
import { fDate } from '@/utils/format-time'
import StyledTableRow from '@/components/table/StyledTableRow'
import TableLoading from '@/components/table/TableLoading'
import TableNoData from '@/components/table/TableNotFound'
import IsBlock from '../student/isBlock'
import Iconify from '@/components/iconify'
import { useClassStudentStore } from '@/stores/classStudent/classStudent.store'

type ClassStudentListProps = {
  data: ClassStudentType[] | undefined
  loading: boolean
  total: number
  page: number
  limit: number
  handleSort: (field: string) => void
  sortField?: string
  sortOrder?: string
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
  const { data, loading, total, limit, page, handleSort, sortField, sortOrder } = props
  const { toogleUpdateStudent } = useClassStudentStore()

  return (
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
                active={sortField === 'classCode'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('classCode')}
              >
                Mã lớp
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
            <TableCell colSpan={2}>
              <TableSortLabel
                active={sortField === 'isBlock'}
                direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                onClick={() => handleSort('isBlock')}
              >
                Trạng thái
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
                <TableCell size='small'> {IsBlock({ isBlock: student.isBlock })}</TableCell>
                <TableCell size='small' align='right'>
                  {/* <Tooltip title='Xem chi tiết'>
                    <IconButton size='small'>
                      <Iconify icon='solar:eye-linear' />
                    </IconButton>
                  </Tooltip> */}
                  <Tooltip title='Chỉnh sửa' onClick={() => toogleUpdateStudent(student)}>
                    <IconButton size='small'>
                      <Iconify icon='mdi:account-edit' />
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
  )
}
