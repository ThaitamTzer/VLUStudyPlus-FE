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
  TablePagination
} from '@mui/material'

import { getInitials } from '@/utils/getInitials'

import type { GradeType } from '@/types/management/gradeTypes'
import StyledTableRow from '@/components/table/StyledTableRow'
import TablePaginationCustom from '@/components/table/TablePagination'
import TableLoading from '@/components/table/TableLoading'
import TableNoData from '@/components/table/TableNotFound'
import Iconify from '@/components/iconify'
import { useGradeStore } from '@/stores/grade/grade.store'

type GradeListProps = {
  data: GradeType[]
  sortField: string
  sortOrder: string
  handleSort: (field: string) => void
  page: number
  limit: number
  searchKey?: string
  classCode?: string
  total: number
  loading: boolean
}

export default function GradeList(props: GradeListProps) {
  const { data, sortField, sortOrder, handleSort, page, limit, searchKey, classCode, total, loading } = props

  const { setIdGrade, toogleViewGradeDetail, setGradeDetail } = useGradeStore()

  const router = useRouter()

  const UserInfor = (data: GradeType) => {
    return (
      <Stack direction='row' spacing={2} alignItems='center'>
        <Avatar
          alt={data.studentId.userName}
          src={data.studentId.userName}
          sx={{
            width: 35,
            height: 35,
            color: 'white',
            backgroundColor: 'primary.main'
          }}
        >
          {getInitials(data.studentId.userName)}
        </Avatar>
        <Stack spacing={1}>
          {data.studentId.userId} - {data.studentId.userName}
          <Typography variant='caption'>{data.studentId.mail}</Typography>
        </Stack>
      </Stack>
    )
  }

  const handleViewGradeDetail = useCallback(
    (idGrade: GradeType) => {
      setIdGrade(idGrade._id)
      setGradeDetail(idGrade)
      toogleViewGradeDetail()
    },
    [setIdGrade, toogleViewGradeDetail, setGradeDetail]
  )

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
              <TableCell width={10}>STT</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'userId'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('userId')}
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
                  active={sortField === 'TCTL_CD'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('TCTL_CD')}
                >
                  Tín chỉ tích lũy cần đạt
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'TCTL_SV'}
                  direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                  onClick={() => handleSort('TCTL_SV')}
                >
                  Tín chỉ tích lũy sinh viên
                </TableSortLabel>
              </TableCell>
              <TableCell></TableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => {
              const stt = (page - 1) * limit + index + 1

              return (
                <StyledTableRow key={item._id}>
                  <TableCell>{stt}</TableCell>
                  <TableCell>{UserInfor(item)}</TableCell>
                  <TableCell>{item.studentId.cohortId}</TableCell>
                  <TableCell>{item.TCTL_CD}</TableCell>
                  <TableCell>{item.TCTL_SV}</TableCell>
                  <TableCell align='right'>
                    <Stack direction='row' spacing={1} alignItems='center' justifyContent='flex-end'>
                      <Tooltip title='Xem bảng điểm'>
                        <IconButton size='medium' onClick={() => handleViewGradeDetail(item)}>
                          <Iconify
                            icon='material-symbols-light:table-eye-rounded'
                            style={{
                              color: '#4E71FF'
                            }}
                          />
                        </IconButton>
                      </Tooltip>
                    </Stack>
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
          params.set('sortField', sortField)
          params.set('sortOrder', sortOrder)

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
