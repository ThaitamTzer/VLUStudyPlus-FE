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
import type { MissingInfoRows } from '@/types/management/learnProcessType'
import TanstackTable from '@/components/TanstackTable'

type TableMissingProps = {
  data: MissingInfoRows[]
}

type MissingInfoRowsWithStt = MissingInfoRows & {
  stt?: number
}

const columnHelper = createColumnHelper<MissingInfoRowsWithStt>()

export default function TableMissing(prop: TableMissingProps) {
  const { data } = prop

  const columns = useMemo<ColumnDef<MissingInfoRowsWithStt, any>[]>(
    () => [
      columnHelper.accessor('stt', {
        header: 'STT',
        cell: info => (
          <>
            dòng <strong>{info.row.original.row}</strong> stt <strong>{info.row.original.stt}</strong>
          </>
        ),
        meta: {
          width: '200px'
        },
        enableSorting: false
      }),
      columnHelper.accessor('message', {
        header: 'Thông báo lỗi',
        cell: info => info.getValue()
      })
    ],
    []
  )

  const table = useReactTable({
    data: data,
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
      <TanstackTable table={table} title='Danh sách lỗi' />
    </Card>
  )
}
