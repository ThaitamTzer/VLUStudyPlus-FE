'use client'

import { useMemo, useState } from 'react'

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
import type { StatisticsProcessOfCVHT, StatisticsProcessOfCVHTType } from '@/types/statisticsType'
import PageHeader from '@/components/page-header'
import { useShare } from '@/hooks/useShare'
import Iconify from '@/components/iconify'

type StatisticsProcessOfCVHTTypeWithSTT = StatisticsProcessOfCVHTType & {
  stt: number
}

// Di chuyển columnHelper ra ngoài component để tránh tạo mới mỗi lần render
const columnHelper = createColumnHelper<StatisticsProcessOfCVHTTypeWithSTT>()

// Memoize columns definition để tránh tạo mới mỗi lần render
const columns: ColumnDef<StatisticsProcessOfCVHTTypeWithSTT, any>[] = [
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
]

export default function StatisticsXLHTstudentProcessOfCVHTPage() {
  const { termOptions } = useShare()
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
    return ['statistics-xlht-cvht', startYear || '2024', endYear || '2025', selectedTerm || '']
  }, [startYear, endYear, selectedTerm])

  const { data, isLoading } = useSWR<StatisticsProcessOfCVHT>(
    swrKey,
    () => statisticsService.getStatisticsByprocessOfCVHT(startYear || '2024', endYear || '2025', selectedTerm || ''),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )

  // Memoize table data
  const tableData = useMemo(() => {
    return (data?.statistics as StatisticsProcessOfCVHTTypeWithSTT[]) || []
  }, [data?.statistics])

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

  const handleExportExcel = async () => {
    const tableData = (data?.statistics as StatisticsProcessOfCVHTTypeWithSTT[]) || []

    if (tableData.length === 0) {
      toast.error('Không có dữ liệu để xuất')

      return
    }

    setIsExport(true)

    try {
      // Tạo workbook và worksheet
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Thống kê XLHT CVHT')

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
      worksheet.mergeCells(universityRow.number, 1, universityRow.number, 8)

      const facultyRow = worksheet.addRow(['KHOA CÔNG NGHỆ THÔNG TIN'])

      facultyRow.getCell(1).font = { bold: true, size: 15 }
      facultyRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' }
      worksheet.mergeCells(facultyRow.number, 1, facultyRow.number, 8)

      // Thêm vài dòng trống để tạo khoảng cách
      worksheet.addRow([])
      worksheet.addRow([])

      // Tiêu đề chính ở giữa
      const titleRow = worksheet.addRow(['THỐNG KÊ SỐ LƯỢNG XLHT CỦA CÁC CVHT THEO HỌC KỲ'])

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
      worksheet.mergeCells(titleRow.number, 1, titleRow.number, 8)

      // Thêm header cho bảng dữ liệu
      const headers = [
        'STT',
        'Cố vấn học tập',
        'Mã lớp',
        'Học kỳ',
        'Ngành',
        'SLSV xử lý',
        'SLSV chưa xử lý',
        'Tổng số lượng'
      ]

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
        const row = worksheet.addRow([
          index + 1,
          item.cvht || '',
          item.classCode || '',
          item.termAbbreviatName || '',
          item.majorName || '',
          item.countslxl || 0,
          item.countsslcxl || 0,
          item.count || 0
        ])

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
      const colWidths = [8, 25, 15, 15, 35, 15, 15, 15]

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
      const fileName = `ThongKe_XLHT_CVHT_${new Date().toISOString().slice(0, 10)}.xlsx`

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
  }

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
                  displayEmpty: true,
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 300
                      }
                    }
                  }
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
          <LoadingButton
            variant='contained'
            color='success'
            startIcon={<Iconify icon='mdi:file-excel' />}
            onClick={handleExportExcel}
            disabled={!data?.statistics || data.statistics.length === 0 || isLoading}
            loading={isExport}
          >
            Xuất Excel ({(data?.statistics || []).length} bản ghi)
          </LoadingButton>
        </div>
        {isLoading ? <Skeleton variant='rectangular' height={500} animation='wave' /> : renderTable}
      </Card>
    </>
  )
}
