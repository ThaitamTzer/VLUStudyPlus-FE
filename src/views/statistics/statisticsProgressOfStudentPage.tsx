'use client'

import { useCallback, useMemo, useState } from 'react'

import useSWR from 'swr'

import {
  createColumnHelper,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Table as TableType
} from '@tanstack/react-table'

import { Card, CardContent, Grid, MenuItem, Skeleton, TablePagination } from '@mui/material'

import { fuzzyFilter } from '../apps/invoice/list/InvoiceListTable'
import TanstackTable from '@/components/TanstackTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import statisticsService from '@/services/statistics.service'
import CustomTextField from '@/@core/components/mui/TextField'
import PageHeader from '@/components/page-header'
import { useShare } from '@/hooks/useShare'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'

interface StatisticsProcessByStudentTTHKType {
  cvht: string
  cohort: string
  classCode: string
  ntn: string
  majorName: string
  counttndh: number
  counttnkdh: number
  countbl: number
  countth: number
}

interface StatisticsProcessByStudentTTHK {
  statistics: StatisticsProcessByStudentTTHKType[]
}

type StatisticsProcessByStudentTTHKTypeWithSTT = StatisticsProcessByStudentTTHKType & {
  stt: number
}

// Di chuyển columnHelper ra ngoài component để tránh tạo mới mỗi lần render
const columnHelper = createColumnHelper<StatisticsProcessByStudentTTHKTypeWithSTT>()

// Memoize columns definition để tránh tạo mới mỗi lần render
const columns: ColumnDef<StatisticsProcessByStudentTTHKTypeWithSTT, any>[] = [
  columnHelper.accessor('stt', {
    header: 'STT',
    cell: info => info.row.index + 1
  }),
  columnHelper.accessor('classCode', {
    header: 'Mã lớp'
  }),
  columnHelper.accessor('cvht', {
    header: 'CVHT'
  }),
  columnHelper.accessor('majorName', {
    header: 'Ngành'
  }),
  columnHelper.accessor('cohort', {
    header: 'Niên chế'
  }),
  columnHelper.accessor('counttndh', {
    header: 'Tốt nghiệp đúng hạn'
  }),
  columnHelper.accessor('counttnkdh', {
    header: 'Tốt nghiệp không đúng hạn'
  }),
  columnHelper.accessor('countbl', {
    header: 'Bảo lưu'
  }),
  columnHelper.accessor('countth', {
    header: 'Thôi học'
  }),
  columnHelper.accessor('ntn', {
    header: 'Năm tốt nghiệp'
  })
]

export default function StatisticsStudentTTHKPage() {
  const { cohorOptions, classOptions } = useShare()

  const [selectedCohort, setSelectedCohort] = useState<string[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedClass, setSelectedClass] = useState<string[]>([])

  // Tối ưu SWR key để tránh re-fetch không cần thiết
  // const swrKey = useMemo(() => {
  //   return selectedClass.length > 0 ? ['statistics-student-tthk', selectedCohort || '', selectedClass.join(',')] : null
  // }, [selectedCohort, selectedClass])

  const { data, isLoading } = useSWR<StatisticsProcessByStudentTTHK>(
    ['statistics-student-tthk', selectedCohort || '', selectedClass.join(',')],
    () => statisticsService.getStatisticsByStudentTTHK(selectedClass, selectedCohort)
  )

  // Memoize table data để tránh re-render table không cần thiết
  const tableData = useMemo(() => {
    return (data?.statistics as unknown as StatisticsProcessByStudentTTHKTypeWithSTT[]) || []
  }, [data])

  // Sử dụng useCallback cho event handlers
  const handleCohortChange = useCallback((_: any, value: any[]) => {
    setSelectedCohort(value.map(item => item._id))
  }, [])

  const handleClassChange = useCallback((_: any, value: any[]) => {
    setSelectedClass(value.map(item => item._id))
  }, [])

  const handlePageSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    table.setPageSize(Number(e.target.value))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { globalFilter },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    filterFns: {
      fuzzy: fuzzyFilter
    },
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    onGlobalFilterChange: setGlobalFilter
  })

  const renderTable = useMemo(() => {
    return (
      <>
        <TanstackTable table={table} loading={isLoading} minWidth={1000} />
        <TablePagination
          component={() => <TablePaginationComponent table={table as TableType<unknown>} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex + 1}
          onPageChange={(_, page) => table.setPageIndex(page - 1)}
        />
      </>
    )
  }, [
    table,
    isLoading,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.getState().pagination.pageIndex,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.getState().pagination.pageSize,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    table.getFilteredRowModel().rows.length
  ])

  return (
    <>
      <PageHeader title='Thống kê số lượng SV đã được cập nhật KQHT theo lớp niên chế' />
      <Card>
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                options={cohorOptions}
                multiple
                getOptionLabel={option => option.cohortId}
                disableCloseOnSelect
                onChange={handleCohortChange}
                renderInput={params => <CustomTextField {...params} label='Chọn niên khóa' />}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <CustomAutocomplete
                options={classOptions}
                multiple
                getOptionLabel={option => option.classId}
                disableCloseOnSelect
                onChange={handleClassChange}
                renderInput={params => <CustomTextField {...params} label='Chọn lớp' />}
              />
            </Grid>
          </Grid>
        </CardContent>
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            className='max-sm:is-full sm:is-[80px]'
            value={table.getState().pagination.pageSize}
            onChange={handlePageSizeChange}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </CustomTextField>
        </div>
        {/* {selectedClass.length === 0 ? (
          <div className='flex justify-center items-center p-8'>
            <div className='text-center text-gray-500'>
              <p className='text-lg mb-2'>📊</p>
              <p>Vui lòng chọn lớp niên chế để xem thống kê</p>
            </div>
          </div>
        ) : isLoading ? (
          <Skeleton variant='rectangular' height={500} animation='wave' />
        ) : (
          renderTable
        )} */}
        {isLoading ? <Skeleton variant='rectangular' height={500} animation='wave' /> : renderTable}
      </Card>
    </>
  )
}
