'use client'

import Link from 'next/link'

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
import TableNoData from '@/components/table/TableNotFound'
import TableLoading from '@/components/table/TableLoading'

type StudentListProps = {
  students: Student[] | undefined
  page: number
  limit: number
  loading: boolean
  total: number
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

export default function StudentList({ students, total, loading, page, limit }: StudentListProps) {
  const { toogleUnBlockStudent, toogleBlockStudent, toogleUpdateStudent, setStudent } = useStudentStore()

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
            <TableCell>STT</TableCell>
            <TableCell>Sinh viên</TableCell>
            <TableCell width={90}>Khóa</TableCell>
            <TableCell>Ngày sinh</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell colSpan={2}>Thời gian truy cập</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {students?.map((student, index) => {
            const stt = (page - 1) * limit + index + 1

            return (
              <StyledTableRow key={student._id}>
                <TableCell size='small'>{stt}</TableCell>
                <TableCell size='small'>{UserInfor(student)}</TableCell>
                <TableCell width={80} size='small'>
                  {student.cohortId}
                </TableCell>
                <TableCell size='small'>{fDate(student.dateOfBirth, 'dd/MM/yyyy') || 'Chưa cập nhật'}</TableCell>
                <TableCell width={116} size='small'>
                  {IsBlock({ isBlock: student.isBlock })}
                </TableCell>
                <TableCell size='small'>{fToNow(student.accessTime) || 'Chưa truy cập'}</TableCell>
                <TableCell width={1} size='small'>
                  <RowAction>
                    <MenuItem>
                      <Link href={`/profile/${student._id}`} prefetch={true} className='flex'>
                        <Iconify icon='solar:eye-linear' className='mr-2' />
                        Xem chi tiết
                      </Link>
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
