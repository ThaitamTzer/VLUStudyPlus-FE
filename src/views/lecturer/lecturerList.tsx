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
import IsBlock from '../student/isBlock'
import { fToNow } from '@/utils/format-time'
import RowAction from '@/components/rowAction'
import Iconify from '@/components/iconify'
import TableNoData from '@/components/table/TableNotFound'
import TableLoading from '@/components/table/TableLoading'
import type { Lecturer } from '@/types/management/lecturerType'
import { useLecturerStore } from '@/stores/lecturer/lecturer'

type LecturerListProps = {
  lecturers: Lecturer[] | undefined
  page: number
  limit: number
  loading: boolean
  total: number
}

const UserInfor = (data: Lecturer) => {
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
        {data.userName}
        <Typography variant='caption'>{data.mail}</Typography>
      </Stack>
    </Stack>
  )
}

export default function LecturerList({ lecturers, total, loading }: LecturerListProps) {
  const { toogleUnBlockLecturer, toogleBlockLecturer, toogleUpdateLecturer, setLecturer } = useLecturerStore()

  const BlockOption = (data: Lecturer) => {
    return (
      <>
        {data.isBlock ? (
          <MenuItem
            onClick={() => {
              setLecturer(data)
              toogleUnBlockLecturer()
            }}
          >
            <Iconify icon='material-symbols:lock-open-outline' />
            Mở khóa
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => {
              setLecturer(data)
              toogleBlockLecturer()
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
            <TableCell>Giảng viên</TableCell>
            <TableCell>Mã giảng viên</TableCell>
            <TableCell>Vai trò</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell colSpan={2}>Thời gian truy cập</TableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {lecturers?.map(lecturer => {
            // const stt = (page - 1) * limit + index + 1

            return (
              <StyledTableRow key={lecturer._id}>
                {/* <TableCell size='small'>{stt}</TableCell> */}
                <TableCell size='small'>{UserInfor(lecturer)}</TableCell>
                <TableCell size='small'>{lecturer.userId}</TableCell>
                <TableCell width={110} size='small'>
                  {lecturer.role?.name || 'Chưa phân quyền'}
                </TableCell>
                <TableCell width={116} size='small'>
                  {IsBlock({ isBlock: lecturer.isBlock })}
                </TableCell>
                <TableCell size='small'>{fToNow(lecturer.accessTime) || 'Chưa truy cập'}</TableCell>
                <TableCell width={1} size='small'>
                  <RowAction>
                    <MenuItem>
                      <Link href={`/lecturer/${lecturer._id}`} prefetch={true} className='flex'>
                        <Iconify icon='solar:eye-linear' className='mr-2' />
                        Xem chi tiết
                      </Link>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setLecturer(lecturer)
                        toogleUpdateLecturer()
                      }}
                    >
                      <Iconify icon='solar:pen-2-linear' />
                      Sửa
                    </MenuItem>
                    {BlockOption(lecturer)}
                  </RowAction>
                </TableCell>
              </StyledTableRow>
            )
          })}
          {loading && total === 0 ? (
            <TableLoading colSpan={12} />
          ) : (
            <TableNoData notFound={total === 0} title='Không tìm thấy giảng viên nào' />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
