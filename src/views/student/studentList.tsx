'use client'

import { Avatar, Stack, Table, TableBody, TableCell, TableContainer, TableHead, Typography } from '@mui/material'

import StyledTableRow from '@/components/table/StyledTableRow'
import type { Student } from '@/types/management/studentType'
import IsBlock from './isBlock'
import { fToNow } from '@/utils/format-time'

type StudentListProps = {
  students: Student[]
  page: number
  limit: number
}

const UserInfor = (data: Student) => {
  return (
    <Stack direction='row' spacing={2} alignItems='center'>
      <Avatar alt={data.userName} src={data.avatar} className='cursor-pointer bs-[38px] is-[38px]'>
        {data.userName}
      </Avatar>
      <Stack spacing={1}>
        {data.userName}
        <Typography variant='caption'>{data.mail}</Typography>
      </Stack>
    </Stack>
  )
}

export default function StudentList({ students, page, limit }: StudentListProps) {
  return (
    <TableContainer sx={{ position: 'relative', overflowX: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
      <Table stickyHeader sx={{ minWidth: 1200 }}>
        <TableHead>
          <StyledTableRow sx={{ textTransform: 'uppercase' }}>
            <TableCell>STT</TableCell>
            <TableCell>Sinh viên</TableCell>
            <TableCell>Mã sinh viên</TableCell>
            <TableCell>Mã lớp</TableCell>
            <TableCell>Niên khóa</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Thời gian truy cập</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {students.map((student, index) => {
            const stt = (page - 1) * limit + index + 1

            return (
              <StyledTableRow key={student._id}>
                <TableCell size='small'>{stt}</TableCell>
                <TableCell size='small'>{UserInfor(student)}</TableCell>
                <TableCell size='small'>{student.userId}</TableCell>
                <TableCell size='small'>{student.classCode}</TableCell>
                <TableCell size='small'>{student.academicYear}</TableCell>
                <TableCell size='small'>{student.role.name}</TableCell>
                <TableCell size='small'>{IsBlock({ isBlock: student.isBlock })}</TableCell>
                <TableCell size='small'>{fToNow(student.accessTime)}</TableCell>
              </StyledTableRow>
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
