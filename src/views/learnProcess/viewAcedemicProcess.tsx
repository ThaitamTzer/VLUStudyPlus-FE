'use client'
import { useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  TableContainer,
  Card,
  Table,
  TableHead,
  TableCell,
  Stack,
  TableBody,
  CardContent,
  Grid,
  MenuItem,
  TablePagination,
  TableSortLabel,
  Button
} from '@mui/material'
import useSWR from 'swr'

import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import learnProcessService from '@/services/learnProcess.service'
import Iconify from '@/components/iconify'
import StyledTableRow from '@/components/table/StyledTableRow'
import type { courseRegistration, processing, ProcessingType } from '@/types/management/learnProcessType'
import TableLoading from '@/components/table/TableLoading'
import TableNoData from '@/components/table/TableNotFound'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'
import TablePaginationCustomNoURL from '@/components/table/TablePaginationNoURL'
import { useShare } from '@/hooks/useShare'
import { getAcademicYear } from '../term/helper'
import ManualAddAcedemicProcess from './manualAddAcedemicProcess'

export default function ViewAcedemicProcess() {
  const {
    openViewByCategory,
    toogleViewByCategory,
    acedemicProcess,
    setAcedemicProcess,
    toogleManualAddFromViewByCate,
    openManualAddFromViewByCate
  } = useAcedemicProcessStore()

  const { cohorOptions } = useShare()

  const id = acedemicProcess?._id

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filterField, setFilterField] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [searchKey, setSearchKey] = useState('')

  const fetcher = [`/api/acedemicProcess/${id}`, page, limit, filterField, filterValue, sortField, sortOrder, searchKey]

  const { data, isLoading, mutate } = useSWR(id ? fetcher : null, () =>
    learnProcessService.viewProcessByCategory(
      id as string,
      page,
      limit,
      filterField,
      filterValue,
      sortField,
      sortOrder,
      searchKey
    )
  )

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortOrder === 'asc'
    const newSortOrder = isAsc ? 'desc' : 'asc'

    setSortField(field)
    setSortOrder(newSortOrder)
    setPage(1)
  }

  const handleClose = () => {
    toogleViewByCategory()
    setPage(1)
    setLimit(10)
    setFilterField('')
    setFilterValue('')
    setSortField('')
    setSortOrder('asc')
    setSearchKey('')
    setAcedemicProcess({} as any)
  }

  const renderStudent = (student: ProcessingType) => {
    return (
      <Stack key={student._id} direction='column'>
        <Stack spacing={2}>
          <p>
            {student.studentId} - {student.lastName} {student.firstName}
          </p>
        </Stack>
        <p>
          Lớp: {student.classId} - {student.cohortName}
        </p>
      </Stack>
    )
  }

  const renderprocessing = (data: processing[]) => {
    return data.map(p => `${p.statusHandling} (${p.termName})`).join('; ')
  }

  const rendercourseRegistration = (data: courseRegistration[]) => {
    return data.map(p => `${p.isRegister ? 'Có' : 'Không'} => (${p.termName})`).join(', ')
  }

  return (
    <>
      <Dialog
        open={openViewByCategory}
        maxWidth='xl'
        onClose={handleClose}
        fullScreen
        onBackdropClick={e => e.stopPropagation()}
      >
        <DialogTitle>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <Iconify icon='mdi:close' color='black' />
          </IconButton>
          <Typography
            variant='h4'
            sx={{
              textTransform: 'uppercase'
            }}
          >
            Danh sách {acedemicProcess?.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Card>
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={3}>
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue=''
                    label='Lọc theo niên khóa'
                    SelectProps={{
                      displayEmpty: true,
                      MenuProps: {
                        sx: {
                          maxHeight: 300
                        }
                      }
                    }}
                    onChange={e => {
                      setFilterField('cohortName')
                      setFilterValue(e.target.value)
                      setPage(1)
                    }}
                  >
                    <MenuItem value=''>Tất cả</MenuItem>
                    {cohorOptions?.map(option => (
                      <MenuItem key={option._id} value={option.cohortId}>
                        {option.cohortId}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>
                <Grid item xs={3}>
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue=''
                    label='Lọc theo năm học'
                    SelectProps={{
                      displayEmpty: true,
                      MenuProps: {
                        sx: {
                          maxHeight: 300
                        }
                      }
                    }}
                    onChange={e => {
                      setFilterField('year')
                      setFilterValue(e.target.value)
                      setPage(1)
                    }}
                  >
                    <MenuItem value=''>Tất cả</MenuItem>
                    {getAcademicYear()?.map(option => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </CustomTextField>
                </Grid>
              </Grid>
            </CardContent>
            <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
              <CustomTextField
                select
                className='max-sm:is-full sm:is-[80px]'
                value={limit}
                onChange={e => {
                  setLimit(Number(e.target.value))
                  setPage(1)
                }}
              >
                <MenuItem value='10'>10</MenuItem>
                <MenuItem value='25'>25</MenuItem>
                <MenuItem value='50'>50</MenuItem>
              </CustomTextField>
              <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
                <DebouncedInput
                  value={searchKey}
                  onChange={value => {
                    setSearchKey(value as string)
                    setPage(1)
                  }}
                  placeholder='Tìm kiếm'
                  className='max-sm:is-full sm:is-[300px]'
                />
                <Button
                  onClick={toogleManualAddFromViewByCate}
                  variant='contained'
                  startIcon={<i className='tabler-plus' />}
                  className='max-sm:is-full'
                >
                  Thêm sinh viên bị xử lý học vụ
                </Button>
              </div>
            </div>
            <TableContainer sx={{ position: 'relative', overflowX: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
              <Table stickyHeader sx={{ minWidth: 1000 }}>
                <TableHead>
                  <StyledTableRow
                    sx={{
                      textTransform: 'uppercase'
                    }}
                  >
                    <TableCell>Stt</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'firstName'}
                        direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                        onClick={() => handleSort('firstName')}
                      >
                        Sinh viên
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'processing'}
                        direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                        onClick={() => handleSort('processing')}
                      >
                        Xử lý học tập
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'handlingStatusByAAO'}
                        direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                        onClick={() => handleSort('handlingStatusByAAO')}
                      >
                        Diện XLHV (PĐT đề nghị)
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'courseRegistration'}
                        direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                        onClick={() => handleSort('courseRegistration')}
                      >
                        Đăng ký môn học
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'DTBC'}
                        direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                        onClick={() => handleSort('DTBC')}
                      >
                        ĐTBC
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'STC'}
                        direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                        onClick={() => handleSort('STC')}
                      >
                        STC
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'DTBCTL'}
                        direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                        onClick={() => handleSort('DTBCTL')}
                      >
                        ĐTBCTL
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'STCTL'}
                        direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                        onClick={() => handleSort('STCTL')}
                      >
                        STCTL
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'reasonHandling'}
                        direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                        onClick={() => handleSort('reasonHandling')}
                      >
                        Lý do XLHV (UIS)
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'yearLevel'}
                        direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                        onClick={() => handleSort('yearLevel')}
                      >
                        Năm thứ
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'faculty'}
                        direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                        onClick={() => handleSort('faculty')}
                      >
                        Khoa
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'year'}
                        direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                        onClick={() => handleSort('year')}
                      >
                        Năm học
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortField === 'termName'}
                        direction={sortOrder === 'desc' ? 'desc' : 'asc'}
                        onClick={() => handleSort('termName')}
                      >
                        Học kỳ
                      </TableSortLabel>
                    </TableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {data?.data.map((d, index) => {
                    const stt = (page - 1) * limit + index + 1

                    return (
                      <StyledTableRow key={d._id}>
                        <TableCell>{stt}</TableCell>
                        <TableCell>{renderStudent(d)}</TableCell>
                        <TableCell>{renderprocessing(d.processing)}</TableCell>
                        <TableCell>{d.handlingStatusByAAO}</TableCell>
                        <TableCell>{rendercourseRegistration(d.courseRegistration)}</TableCell>
                        <TableCell>{d.DTBC}</TableCell>
                        <TableCell>{d.STC}</TableCell>
                        <TableCell>{d.DTBCTL}</TableCell>
                        <TableCell>{d.STCTL}</TableCell>
                        <TableCell>{d.reasonHandling}</TableCell>
                        <TableCell>{d.yearLevel}</TableCell>
                        <TableCell>{d.faculty}</TableCell>
                        <TableCell>{d.year}</TableCell>
                        <TableCell>{d.termName}</TableCell>
                      </StyledTableRow>
                    )
                  })}
                  {isLoading ? (
                    <TableLoading colSpan={20} />
                  ) : (
                    <TableNoData notFound={data?.data.length === 0} title={'Không tìm dữ liệu nào'} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component={() => (
                <TablePaginationCustomNoURL
                  data={data?.data || []}
                  page={page}
                  limit={limit}
                  total={data?.pagination.totalItems || 0}
                  setPage={setPage}
                />
              )}
              count={data?.pagination.totalItems || 0}
              page={page - 1}
              rowsPerPage={limit}
              rowsPerPageOptions={[10, 25, 50]}
              onPageChange={(_, newPage) => {
                setPage(newPage + 1)
              }}
            />
          </Card>
        </DialogContent>
      </Dialog>
      <ManualAddAcedemicProcess
        mutate={mutate}
        onClose={toogleManualAddFromViewByCate}
        open={openManualAddFromViewByCate}
      />
    </>
  )
}
