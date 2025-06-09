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

import { Card, CardContent, Grid, MenuItem, Skeleton, TablePagination, Button } from '@mui/material'

import { fuzzyFilter } from '../apps/invoice/list/InvoiceListTable'
import TanstackTable from '@/components/TanstackTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import statisticsService from '@/services/statistics.service'
import CustomTextField from '@/@core/components/mui/TextField'
import PageHeader from '@/components/page-header'
import { useShare } from '@/hooks/useShare'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import Iconify from '@/components/iconify'

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
        'Niên chế': item.cohort || '',
        'Tốt nghiệp đúng hạn': item.counttndh || 0,
        'Tốt nghiệp không đúng hạn': item.counttnkdh || 0,
        'Bảo lưu': item.countbl || 0,
        'Thôi học': item.countth || 0,
        'Năm tốt nghiệp': item.ntn || ''
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
      ws['A1'] = { v: 'Thống kê tiến độ tốt nghiệp sinh viên theo lớp niên chế', t: 's' }

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
        { wch: 12 }, // Niên chế
        { wch: 18 }, // Tốt nghiệp đúng hạn
        { wch: 20 }, // Tốt nghiệp không đúng hạn
        { wch: 12 }, // Bảo lưu
        { wch: 12 }, // Thôi học
        { wch: 15 } // Năm tốt nghiệp
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

      XLSX.utils.book_append_sheet(wb, ws, 'Thống kê tiến độ SV')

      // Tạo tên file với thời gian hiện tại
      const fileName = `ThongKe_TienDoSinhVien_${new Date().toISOString().slice(0, 10)}.xlsx`

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
      <PageHeader title='Thống kê tiến độ tốt nghiệp sinh viên theo lớp niên chế' />
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
        {isLoading ? <Skeleton variant='rectangular' height={500} animation='wave' /> : renderTable}
      </Card>
    </>
  )
}
