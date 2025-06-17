'use client'

import { useCallback, useMemo, useState } from 'react'

import useSWR from 'swr'
import ExcelJS from 'exceljs'
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

import { Card, CardContent, FormControl, Grid, MenuItem, Skeleton, TablePagination } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import { fuzzyFilter } from '../apps/invoice/list/InvoiceListTable'
import TanstackTable from '@/components/TanstackTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import statisticsService from '@/services/statistics.service'
import CustomTextField from '@/@core/components/mui/TextField'
import type { StatisticsProcessByClass, StatisticsProcessByClassType } from '@/types/statisticsType'
import PageHeader from '@/components/page-header'
import { useShare } from '@/hooks/useShare'
import CustomAutocomplete from '@/@core/components/mui/Autocomplete'
import Iconify from '@/components/iconify'

type StatisticsProcessByClassTypeWithSTT = StatisticsProcessByClassType & {
  stt: number
}

// Di chuyển columnHelper ra ngoài component để tránh tạo mới mỗi lần render
const columnHelper = createColumnHelper<StatisticsProcessByClassTypeWithSTT>()

// Memoize columns definition để tránh tạo mới mỗi lần render
const columns: ColumnDef<StatisticsProcessByClassTypeWithSTT, any>[] = [
  columnHelper.accessor('stt', {
    header: 'STT',
    cell: info => info.row.index + 1
  }),
  columnHelper.accessor('classCode', {
    header: 'Mã lớp'
  }),
  columnHelper.accessor('termAbbreviatName', {
    header: 'Học kỳ'
  }),
  columnHelper.accessor('count', {
    header: 'Số lượng'
  })
]

export default function StatisticsXLHTClassPage() {
  const { termOptions, classOptions } = useShare()

  const today = new Date().toISOString().split('T')[0]

  const currentTerm = useMemo(() => {
    return termOptions.find(term => {
      return today >= term.startDate && today <= term.endDate
    })
  }, [termOptions, today])

  const currentAcademicYear = useMemo(() => {
    return new Date().getFullYear()
  }, [])

  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>(
    `${currentAcademicYear}-${currentAcademicYear + 1}`
  )

  const [selectedTerm, setSelectedTerm] = useState<string>(currentTerm?._id || '')
  const [globalFilter, setGlobalFilter] = useState('')
  const [selectedClass, setSelectedClass] = useState<string[]>([])
  const [isExport, setIsExport] = useState(false)

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
      ? [
          'statistics-xlht-student-by-class',
          startYear || '2024',
          endYear || '2025',
          selectedTerm || '',
          selectedClass.join(',')
        ]
      : null
  }, [startYear, endYear, selectedTerm, selectedClass])

  const { data, isLoading } = useSWR<StatisticsProcessByClass>(swrKey, () =>
    statisticsService.getStatisticsByClass(startYear || '2024', endYear || '2025', selectedTerm || '', selectedClass)
  )

  // Memoize table data để tránh re-render table không cần thiết
  const tableData = useMemo(() => {
    return (data?.statistics as StatisticsProcessByClassTypeWithSTT[]) || []
  }, [data?.statistics])

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

    setIsExport(true)

    try {
      // Tạo workbook và worksheet
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Thống kê XLHT theo lớp')

      // Thêm logo
      try {
        const logoResponse = await fetch('/images/logo-van-lang.png')
        const logoBuffer = await logoResponse.arrayBuffer()

        const logoId = workbook.addImage({
          buffer: logoBuffer,
          extension: 'png'
        })

        worksheet.addImage(logoId, {
          tl: { col: 1, row: 1 },
          ext: { width: 100, height: 100 }
        })
      } catch (logoError) {
        console.warn('Không thể tải logo:', logoError)
      }

      // Thêm dòng trống để tạo khoảng cách cho logo
      worksheet.addRow([])
      worksheet.addRow([])
      worksheet.addRow([])
      worksheet.addRow([])

      // Thêm header trường đại học bên cạnh logo (cột B)
      const universityRow = worksheet.addRow(['TRƯỜNG ĐẠI HỌC VĂN LANG'])

      universityRow.getCell(1).font = { bold: true, size: 16 }
      universityRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' }
      worksheet.mergeCells(universityRow.number, 1, universityRow.number, 4)

      const facultyRow = worksheet.addRow(['KHOA CÔNG NGHỆ THÔNG TIN'])

      facultyRow.getCell(1).font = { bold: true, size: 15 }
      facultyRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' }
      worksheet.mergeCells(facultyRow.number, 1, facultyRow.number, 4)

      // Thêm vài dòng trống để tạo khoảng cách
      worksheet.addRow([])
      worksheet.addRow([])

      // Tiêu đề chính ở giữa
      const titleRow = worksheet.addRow(['THỐNG KÊ XLHT SINH VIÊN THEO LỚP NIÊN CHẾ'])

      titleRow.getCell(1).font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } }
      titleRow.getCell(1).alignment = { horizontal: 'center', vertical: 'middle' }
      titleRow.getCell(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
      }
      titleRow.getCell(1).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
      worksheet.mergeCells(titleRow.number, 1, titleRow.number, 4)

      // Thêm header cho bảng dữ liệu
      const headers = ['STT', 'Mã lớp', 'Học kỳ', 'Số lượng']
      const headerRow = worksheet.addRow(headers)

      // Style cho header
      headerRow.eachCell((cell: any) => {
        cell.font = { bold: true }
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD9E1F2' }
        }
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
      })

      // Thêm dữ liệu
      tableData.forEach((item, index) => {
        const row = worksheet.addRow([index + 1, item.classCode || '', item.termAbbreviatName || '', item.count || 0])

        // Style cho dữ liệu
        row.eachCell((cell: any) => {
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          }
        })
      })

      // Tự động điều chỉnh độ rộng cột
      const colWidths = [8, 20, 20, 15]

      worksheet.columns.forEach((column: any, index: number) => {
        if (colWidths[index]) {
          column.width = colWidths[index]
        }
      })

      // Thêm phần ký tên ở cuối
      const currentDate = new Date()
      const dateString = `TP.HCM, ngày   tháng   năm ${currentDate.getFullYear()}`

      // Thêm dòng ngày tháng và merge với toàn bộ số cột
      const totalColumns = headers.length
      const dateRow = worksheet.addRow([dateString])

      dateRow.getCell(1).alignment = { horizontal: 'right' }
      dateRow.getCell(1).font = { italic: true }

      // Merge dòng ngày tháng từ cột A đến cột cuối
      worksheet.mergeCells(dateRow.number, 1, dateRow.number, totalColumns)

      // Thêm dòng "Người lập danh sách" và merge với toàn bộ số cột
      const signerRow = worksheet.addRow(['Người lập danh sách              '])

      signerRow.getCell(1).alignment = { horizontal: 'right' }
      signerRow.getCell(1).font = { bold: true }

      // Merge dòng người ký từ cột A đến cột cuối
      worksheet.mergeCells(signerRow.number, 1, signerRow.number, totalColumns)

      // Tạo tên file với thời gian hiện tại
      const fileName = `ThongKe_XLHT_TheoLop_${new Date().toISOString().slice(0, 10)}.xlsx`

      // Xuất file
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')

      a.href = url
      a.download = fileName
      a.click()
      window.URL.revokeObjectURL(url)

      toast.success('Xuất Excel thành công!')
    } catch (error) {
      console.error('Lỗi khi xuất Excel:', error)
      toast.error('Có lỗi xảy ra khi xuất Excel. Vui lòng thử lại!')
    } finally {
      setIsExport(false)
    }
  }, [tableData])

  return (
    <>
      <PageHeader title='Thống kê XLHT sinh viên theo lớp niên chế' />
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
                  displayEmpty: true,
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }
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
          <LoadingButton
            variant='contained'
            color='success'
            startIcon={<Iconify icon='mdi:file-excel' />}
            onClick={handleExportExcel}
            disabled={tableData.length === 0 || isLoading}
            loading={isExport}
          >
            Xuất Excel ({tableData.length} bản ghi)
          </LoadingButton>
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
