'use client'
import { useMemo, useState } from 'react'

import type { ColumnDef, Table } from '@tanstack/react-table'
import {
  createColumnHelper,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFilteredRowModel,
  useReactTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  getPaginationRowModel
} from '@tanstack/react-table'

import { Card, CardContent, Grid, TablePagination } from '@mui/material'

import { fuzzyFilter } from '../apps/invoice/list/InvoiceListTable'

import TanstackTable from '@/components/TanstackTable'
import type { Inserted } from '@/types/management/learnProcessType'
import DebouncedInput from '@/components/debouncedInput'
import TablePaginationComponent from '@/components/TablePaginationComponent'

type ImportedTypeWithStt = Inserted & {
  stt?: number
}

const columnHelper = createColumnHelper<ImportedTypeWithStt>()

type TableImportedProps = {
  data: Inserted[]
}

export default function TableImported(prop: TableImportedProps) {
  const { data } = prop
  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<ImportedTypeWithStt, any>[]>(
    () => [
      columnHelper.accessor('stt', {
        header: 'STT',
        cell: info => info.row.index + 1,
        meta: {
          width: 1
        },
        enableSorting: false
      }),
      columnHelper.accessor('studentId', {
        header: 'Mã SV',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('lastName', {
        header: 'Họ',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('firstName', {
        header: 'Tên',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('cohortName', {
        header: 'Khóa',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('classId', {
        header: 'Lớp',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('groupedByInstruction', {
        header: 'Đối tượng',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('sdtsv', {
        header: 'Sdt SV',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('sdtlh', {
        header: 'Sdt LH',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('sdthktt', {
        header: 'Sdt HKTT',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('sdtcha', {
        header: 'Sdt Cha',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('sdtme', {
        header: 'Sdt Mẹ',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('major', {
        header: 'Ngành',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('DTBC', {
        header: 'DTBC',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('DTBCTL', {
        header: 'DTBCTL',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('DTB10', {
        header: 'DTB10',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('DTBCTL10', {
        header: 'DTBCTL10',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('TCTL', {
        header: 'TCTL',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('TCCN', {
        header: 'TCCN',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('TONGTCCTDT', {
        header: 'TONGTCCTDT',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('percentTL', {
        header: '% TL',
        cell: info => {
          const value = info.getValue()

          if (value === null || value === undefined) return '-'

          // Parse the value to ensure it's a number, then round to integer
          const numValue = typeof value === 'string' ? parseFloat(value) : value

          return Math.round(numValue)
        }
      }),
      columnHelper.accessor('processingHandle.statusProcess', {
        header: () => {
          const processingHandleObj = data[0]?.processingHandle || {}
          const note = processingHandleObj.note || ''

          return (
            <div>
              <span>XLHT - {note} (UIS - XLHT theo quy chế)</span>
            </div>
          )
        },
        cell: info => info.getValue()
      }),
      columnHelper.accessor('countWarning.academicWarningsCount', {
        header: () => {
          const countWarningObj = data[0]?.countWarning || {}
          const note = countWarningObj.note || ''

          return (
            <div>
              <span>Đếm số lần bị XLHT qua 10 học kỳ ({note})</span>
            </div>
          )
        },
        cell: info => info.getValue()
      }),
      columnHelper.accessor('courseRegistration.note', {
        header: 'Tình trạng ĐKHP HK tiếp theo',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('RQS', {
        header: 'RQS',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('faculty', {
        header: 'Khoa',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('list', {
        header: 'Danh sách',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('list', {
        header: 'Danh sách',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('statusOn.status', {
        header: () => {
          const statusOnObj = data[0]?.statusOn || {}
          const note = statusOnObj.note || ''

          return (
            <div>
              <span>Tình trạng ({note})</span>
            </div>
          )
        },
        cell: info => info.getValue()
      }),
      columnHelper.accessor('yearLevel', {
        header: 'SV năm thứ (xếp theo STC trung bình toàn trường)',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('reasonHandling.reason', {
        header: () => {
          const reasonHandlingObj = data[0]?.reasonHandling || {}
          const note = reasonHandlingObj.note || ''

          return (
            <div>
              <span>Lý do XLHT ({note})</span>
            </div>
          )
        },
        cell: info => info.getValue()
      }),
      columnHelper.accessor('resultHandlingBefore', {
        header: 'Kết quả XLHT các HK trước',
        cell: info => info.getValue()
      })
    ],
    [data]
  )

  const table = useReactTable({
    data: data || [],
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

  return (
    <Card>
      <CardContent>
        <Grid container>
          <Grid item xs={12} sm={4}>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Tìm kiếm'
              className='max-sm:is-full'
              fullWidth
            />
          </Grid>
        </Grid>
      </CardContent>
      <TanstackTable table={table} title='Danh sách xử lý học tập đã thêm' />
      <TablePagination
        component={() => <TablePaginationComponent table={table as Table<unknown>} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex + 1}
        onPageChange={(_, page) => table.setPageIndex(page - 1)}
      />
    </Card>
  )
}
