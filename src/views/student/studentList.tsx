'use client'

import {
  Avatar,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography
} from '@mui/material'

import StyledTableRow from '@/components/table/StyledTableRow'
import type { Student } from '@/types/management/studentType'
import { useStudentStore } from '@/stores/student/student'
import IsBlock from './isBlock'
import { fDate, fToNow } from '@/utils/format-time'
import RowAction from '@/components/rowAction'
import Iconify from '@/components/iconify'

type StudentListProps = {
  students: Student[]
  page: number
  limit: number
}

const UserInfor = (data: Student) => {
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

export default function StudentList({ students }: StudentListProps) {
  const { toogleUnBlockStudent, toogleBlockStudent, toogleUpdateStudent, toogleViewDetail, setStudent } =
    useStudentStore()

  const BlockOption = (data: Student) => {
    return (
      <>
        {data.isBlock ? (
          <MenuItem
            onClick={() => {
              setStudent(data)
              toogleUnBlockStudent()
            }}
          >
            <Iconify icon='material-symbols:lock-open-outline' />
            Mở khóa
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setStudent(data)
              toogleBlockStudent()
            }}
          >
            <Iconify icon='material-symbols:lock-outline' />
            Khóa
          </MenuItem>
        )}
      </>
    )
  }

  return (
    <TableContainer sx={{ position: 'relative', overflowX: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
      <Table stickyHeader sx={{ minWidth: 1100 }}>
        <TableHead>
          <StyledTableRow sx={{ textTransform: 'uppercase' }}>
            {/* <TableCell>STT</TableCell> */}
            <TableCell>Sinh viên</TableCell>
            {/* <TableCell>Mã sinh viên</TableCell> */}
            {/* <TableCell>Mã lớp</TableCell> */}
            <TableCell width={90}>Khóa</TableCell>
            <TableCell>Ngày sinh</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell colSpan={2}>Thời gian truy cập</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {students.map(student => {
            // const stt = (page - 1) * limit + index + 1

            return (
              <StyledTableRow key={student._id}>
                {/* <TableCell size='small'>{stt}</TableCell> */}
                <TableCell size='small'>{UserInfor(student)}</TableCell>
                {/* <TableCell size='small'>{student.userId}</TableCell> */}
                {/* <TableCell size='small'>{student.classCode}</TableCell> */}
                <TableCell width={80} size='small'>
                  {student.cohortId}
                </TableCell>
                <TableCell size='small'>{fDate(student.dateOfBirth, 'dd/MM/yyyy') || 'Chưa cập nhật'}</TableCell>
                <TableCell size='small'>{student.role?.name || 'Chưa phân quyền'}</TableCell>
                <TableCell size='small'>{IsBlock({ isBlock: student.isBlock })}</TableCell>
                <TableCell size='small'>{fToNow(student.accessTime) || 'Chưa truy cập'}</TableCell>
                <TableCell size='small'>
                  <RowAction>
                    <MenuItem
                      onClick={() => {
                        setStudent(student)
                        toogleViewDetail()
                      }}
                    >
                      <Iconify icon='solar:eye-linear' />
                      Xem chi tiết
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setStudent(student)
                        toogleUpdateStudent()
                      }}
                    >
                      <Iconify icon='solar:pen-2-linear' />
                      Sửa
                    </MenuItem>
                    {BlockOption(student)}
                  </RowAction>
                </TableCell>
              </StyledTableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
