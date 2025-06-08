'use client'

import { useMemo, useState } from 'react'

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

import { Card, CardContent, FormControl, Grid, MenuItem, Skeleton, TablePagination } from '@mui/material'

import { fuzzyFilter } from '../apps/invoice/list/InvoiceListTable'
import TanstackTable from '@/components/TanstackTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import statisticsService from '@/services/statistics.service'
import CustomTextField from '@/@core/components/mui/TextField'
import type { StatisticsProcessOfCVHT, StatisticsProcessOfCVHTType } from '@/types/statisticsType'
import PageHeader from '@/components/page-header'
import { useShare } from '@/hooks/useShare'

type StatisticsProcessOfCVHTTypeWithSTT = StatisticsProcessOfCVHTType & {
  stt: number
}

// Di chuyển columnHelper ra ngoài component để tránh tạo mới mỗi lần render
const columnHelper = createColumnHelper<StatisticsProcessOfCVHTTypeWithSTT>()

export default function StatisticsXLHTstudentProcessOfCVHTPage() {
  const { termOptions } = useShare()
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2024-2025')
  const [selectedTerm, setSelectedTerm] = useState<string>('')

  const [globalFilter, setGlobalFilter] = useState('')

  const academicYears = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const years = []

    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.push(`${i}-${i + 1}`)
    }

    return years
  }, [])

  // Tách năm học thành startYear và endYear
  const { startYear, endYear } = useMemo(() => {
    if (!selectedAcademicYear) return { startYear: undefined, endYear: undefined }
    const [start, end] = selectedAcademicYear.split('-')

    return { startYear: start, endYear: end }
  }, [selectedAcademicYear])

  const { data, isLoading } = useSWR<StatisticsProcessOfCVHT>(
    ['statistics-xlht-cvht', startYear || '2024', endYear || '2025', selectedTerm || ''],
    () => statisticsService.getStatisticsByprocessOfCVHT(startYear || '2024', endYear || '2025', selectedTerm || '')
  )

  const columns = useMemo<ColumnDef<StatisticsProcessOfCVHTTypeWithSTT, any>[]>(
    () => [
      columnHelper.accessor('stt', {
        header: 'STT',
        cell: info => info.row.index + 1
      }),
      columnHelper.accessor('cvht', {
        header: 'Cố vấn học tập'
      }),
      columnHelper.accessor('classCode', {
        header: 'Mã lớp'
      }),
      columnHelper.accessor('termAbbreviatName', {
        header: 'Học kỳ'
      }),
      columnHelper.accessor('majorName', {
        header: 'Ngành'
      }),
      columnHelper.accessor('countslxl', {
        header: 'SLSV xử lý'
      }),
      columnHelper.accessor('countsslcxl', {
        header: 'SLSV chưa xử lý'
      }),
      columnHelper.accessor('count', {
        header: 'Tổng số lượng'
      })
    ],
    [] // Loại bỏ columnHelper khỏi dependency array
  )

  const table = useReactTable({
    data: (data?.statistics as StatisticsProcessOfCVHTTypeWithSTT[]) || [],
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
      <PageHeader title='Thống kê số lượng XLHT của các CVHT theo học kỳ' />
      <Card>
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <CustomTextField
                select
                label='Chọn học kỳ'
                fullWidth
                value={selectedTerm}
                SelectProps={{
                  displayEmpty: true
                }}
                onChange={e => setSelectedTerm(e.target.value)}
              >
                <MenuItem value=''>Tất cả</MenuItem>
                {termOptions.map(term => {
                  return (
                    <MenuItem key={term._id} value={term._id}>
                      {term.abbreviatName}
                    </MenuItem>
                  )
                })}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <CustomTextField
                  value={selectedAcademicYear}
                  label='Năm học'
                  select
                  onChange={e => setSelectedAcademicYear(e.target.value)}
                >
                  {academicYears.map(year => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            className='max-sm:is-full sm:is-[80px]'
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </CustomTextField>
        </div>
        {isLoading ? <Skeleton variant='rectangular' height={500} animation='wave' /> : renderTable}
      </Card>
    </>
  )
}
