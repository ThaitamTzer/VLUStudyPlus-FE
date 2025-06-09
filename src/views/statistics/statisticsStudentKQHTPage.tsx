'use client'

import { useCallback, useMemo, useState } from 'react'

import useSWR from 'swr'
import * as XLSX from 'xlsx-js-style'
import { toast } from 'react-toastify'

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

import { Card, CardContent, FormControl, Grid, MenuItem, Skeleton, TablePagination, Button } from '@mui/material'

import { fuzzyFilter } from '../apps/invoice/list/InvoiceListTable'
import TanstackTable from '@/components/TanstackTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import statisticsService from '@/services/statistics.service'
import CustomTextField from '@/@core/components/mui/TextField'
import type { StatisticsProcessByStudentKQHTType } from '@/types/statisticsType'
import PageHeader from '@/components/page-header'
import { useShare } from '@/hooks/useShare'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import Iconify from '@/components/iconify'

type StatisticsProcessByStudentKQHTTypeWithSTT = StatisticsProcessByStudentKQHTType & {
  stt: number
}

// Di chuyển columnHelper ra ngoài component để tránh tạo mới mỗi lần render
const columnHelper = createColumnHelper<StatisticsProcessByStudentKQHTTypeWithSTT>()

// Memoize columns definition để tránh tạo mới mỗi lần render
const columns: ColumnDef<StatisticsProcessByStudentKQHTTypeWithSTT, any>[] = [
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
  columnHelper.accessor('termAbbreviatName', {
    header: 'Học kỳ'
  }),
  columnHelper.accessor('countdnd', {
    header: 'SL đã có điểm'
  }),
  columnHelper.accessor('countcnd', {
    header: 'SL chưa có điểm'
  }),
  columnHelper.accessor('count', {
    header: 'Tổng số lượng'
  })
]

export default function StatisticsStudentKQHTPage() {
  const { termOptions, classOptions } = useShare()

  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('2024-2025')
  const [selectedTerm, setSelectedTerm] = useState<string>('')
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedClass, setSelectedClass] = useState<string[]>([])

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

  // Tối ưu SWR key để tránh re-fetch không cần thiết
  const swrKey = useMemo(() => {
    return selectedClass.length > 0
      ? ['statistics-student-kqht', startYear || '2024', endYear || '2025', selectedTerm || '', selectedClass.join(',')]
      : null
  }, [startYear, endYear, selectedTerm, selectedClass])

  const { data, isLoading } = useSWR<StatisticsProcessByStudentKQHTType>(swrKey, () =>
    statisticsService.getStatisticsByStudentKQHT(
      startYear || '2024',
      endYear || '2025',
      selectedTerm || '',
      selectedClass
    )
  )

  // Memoize table data để tránh re-render table không cần thiết
  const tableData = useMemo(() => {
    return (data as unknown as StatisticsProcessByStudentKQHTTypeWithSTT[]) || []
  }, [data])

  // Sử dụng useCallback cho event handlers
  const handleTermChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTerm(e.target.value)
  }, [])

  const handleAcademicYearChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAcademicYear(e.target.value)
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

  const handleExportExcel = useCallback(async () => {
    if (tableData.length === 0) {
      toast.error('Không có dữ liệu để xuất')

      return
    }

    try {
      // Tạo dữ liệu cho Excel
      const excelData = tableData.map((item, index) => ({
        STT: index + 1,
        'Mã lớp': item.classCode || '',
        CVHT: item.cvht || '',
        Ngành: item.majorName || '',
        'Học kỳ': item.termAbbreviatName || '',
        'SL đã có điểm': item.countdnd || 0,
        'SL chưa có điểm': item.countcnd || 0,
        'Tổng số lượng': item.count || 0
      }))

      // Tạo worksheet
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Thêm một dòng trống ở đầu cho tiêu đề
      XLSX.utils.sheet_add_aoa(ws, [[]], { origin: 'A1' })

      // Dịch chuyển tất cả dữ liệu xuống 1 dòng
      const range = XLSX.utils.decode_range(ws['!ref'] || '')

      for (let R = range.e.r; R >= 0; R--) {
        for (let C = range.s.c; C <= range.e.c; C++) {
          const oldCell = XLSX.utils.encode_cell({ r: R, c: C })
          const newCell = XLSX.utils.encode_cell({ r: R + 1, c: C })

          if (ws[oldCell]) {
            ws[newCell] = ws[oldCell]
            delete ws[oldCell]
          }
        }
      }

      // Thêm tiêu đề vào ô A1
      ws['A1'] = { v: 'Thống kê số lượng SV đã được cập nhật KQHT theo lớp niên chế', t: 's' }

      // Cập nhật range để bao gồm tiêu đề
      const numCols = Object.keys(excelData[0] || {}).length

      ws['!ref'] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: excelData.length + 1, c: numCols - 1 } })

      // Merge ô tiêu đề để trải dài qua tất cả các cột
      ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: numCols - 1 } }]

      // Tự động điều chỉnh độ rộng cột
      const colWidths = [
        { wch: 5 }, // STT
        { wch: 15 }, // Mã lớp
        { wch: 20 }, // CVHT
        { wch: 25 }, // Ngành
        { wch: 15 }, // Học kỳ
        { wch: 15 }, // SL đã có điểm
        { wch: 15 }, // SL chưa có điểm
        { wch: 15 } // Tổng số lượng
      ]

      ws['!cols'] = colWidths

      // Style cho tiêu đề
      const titleStyle = {
        font: { bold: true, sz: 16, color: { rgb: '000000' } },
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        fill: { fgColor: { rgb: '4472C4' } },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } }
        }
      }

      // Áp dụng style cho tiêu đề
      if (ws['A1']) {
        ws['A1'].s = titleStyle
      }

      // Style cho header
      const headerStyle = {
        font: { bold: true, color: { rgb: '000000' } },
        alignment: { vertical: 'center', horizontal: 'center', wrapText: true },
        fill: { fgColor: { rgb: 'D9E1F2' } },
        border: {
          top: { style: 'thin', color: { rgb: '000000' } },
          bottom: { style: 'thin', color: { rgb: '000000' } },
          left: { style: 'thin', color: { rgb: '000000' } },
          right: { style: 'thin', color: { rgb: '000000' } }
        }
      }

      // Áp dụng style cho header (dòng 2)
      for (let C = 0; C < numCols; ++C) {
        const headerCell = XLSX.utils.encode_cell({ r: 1, c: C })

        if (ws[headerCell]) {
          ws[headerCell].s = headerStyle
        }
      }

      // Style cho dữ liệu (bắt đầu từ dòng 3)
      for (let R = 2; R < excelData.length + 2; ++R) {
        for (let C = 0; C < numCols; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C })

          if (ws[cellAddress]) {
            ws[cellAddress].s = {
              alignment: { vertical: 'center', horizontal: 'center' },
              border: {
                top: { style: 'thin', color: { rgb: '000000' } },
                bottom: { style: 'thin', color: { rgb: '000000' } },
                left: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'thin', color: { rgb: '000000' } }
              }
            }
          }
        }
      }

      // Tạo workbook
      const wb = XLSX.utils.book_new()

      XLSX.utils.book_append_sheet(wb, ws, 'Thống kê KQHT')

      // Tạo tên file với thời gian hiện tại
      const fileName = `ThongKe_KQHT_SinhVien_${new Date().toISOString().slice(0, 10)}.xlsx`

      // Xuất file
      XLSX.writeFile(wb, fileName)
      toast.success('Xuất Excel thành công!')
    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error)
      toast.error('Có lỗi xảy ra khi xuất Excel. Vui lòng thử lại!')
    }
  }, [tableData])

  return (
    <>
      <PageHeader title='Thống kê số lượng SV đã được cập nhật KQHT theo lớp niên chế' />
      <Card>
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <CustomTextField
                select
                label='Chọn học kỳ'
                fullWidth
                value={selectedTerm}
                SelectProps={{
                  displayEmpty: true
                }}
                onChange={handleTermChange}
              >
                <MenuItem value=''>Tất cả</MenuItem>
                {termOptions.map(term => (
                  <MenuItem key={term._id} value={term._id}>
                    {term.abbreviatName}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <CustomTextField
                  value={selectedAcademicYear}
                  label='Năm học'
                  select
                  SelectProps={{
                    displayEmpty: true
                  }}
                  onChange={handleAcademicYearChange}
                >
                  <MenuItem value=''>Tất cả</MenuItem>
                  {academicYears.map(year => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </FormControl>
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
          <Button
            variant='contained'
            color='success'
            startIcon={<Iconify icon='mdi:file-excel' />}
            onClick={handleExportExcel}
            disabled={tableData.length === 0 || isLoading}
          >
            Xuất Excel ({tableData.length} bản ghi)
          </Button>
        </div>
        {selectedClass.length === 0 ? (
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
        )}
      </Card>
    </>
  )
}
