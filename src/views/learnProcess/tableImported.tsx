'use client'
import { useMemo } from 'react'

import type { ColumnDef } from '@tanstack/react-table'
import {
  createColumnHelper,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel
} from '@tanstack/react-table'

import { Card } from '@mui/material'

import { fuzzyFilter } from '../apps/invoice/list/InvoiceListTable'

import TanstackTable from '@/components/TanstackTable'
import type { Inserted } from '@/types/management/learnProcessType'

type ImportedTypeWithStt = Inserted & {
  stt?: number
}

const columnHelper = createColumnHelper<ImportedTypeWithStt>()

type TableImportedProps = {
  data: Inserted[]
}

export default function TableImported(prop: TableImportedProps) {
  const { data } = prop

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
      columnHelper.accessor('classId', {
        header: 'Lớp',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('cohortName', {
        header: 'Khóa',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('faculty', {
        header: 'Khoa',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('year', {
        header: 'Năm học',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('termName', {
        header: 'Học kỳ',
        cell: info => info.getValue()
      }),
      columnHelper.accessor('handlingStatusByAAO', {
        header: 'Trạng thái xử lý',
        cell: info => info.getValue()
      }),

      // columnHelper.accessor('DTBC', {
      //   header: 'ĐTB',
      //   cell: info => info.getValue()
      // }),
      // columnHelper.accessor('STC', {
      //   header: 'STC',
      //   cell: info => info.getValue()
      // }),
      // columnHelper.accessor('DTBCTL', {
      //   header: 'ĐTBCTL',
      //   cell: info => info.getValue()
      // }),
      // columnHelper.accessor('STCTL', {
      //   header: 'STCTL',
      //   cell: info => info.getValue()
      // }),
      columnHelper.accessor('reasonHandling', {
        header: 'Lý do xử lý',
        cell: info => info.getValue()
      })
    ],
    []
  )

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter
    },
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Card sx={{ position: 'relative', overflowX: 'auto', maxHeight: 'calc(100vh - 300px)' }}>
      <TanstackTable table={table} title='Danh sách xử lý học tập đã thêm' />
    </Card>
  )
}
