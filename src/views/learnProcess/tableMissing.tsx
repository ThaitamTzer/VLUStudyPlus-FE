'use client'
import { useMemo, useState } from 'react'

import type { ColumnDef, Table } from '@tanstack/react-table'
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

import { Card, CardContent, Grid, TablePagination } from '@mui/material'

import { fuzzyFilter } from '../apps/invoice/list/InvoiceListTable'
import type { MissingInfoRows } from '@/types/management/learnProcessType'
import TanstackTable from '@/components/TanstackTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import DebouncedInput from '@/components/debouncedInput'

type TableMissingProps = {
  data: MissingInfoRows[]
}

type MissingInfoRowsWithStt = MissingInfoRows & {
  stt?: number
}

const columnHelper = createColumnHelper<MissingInfoRowsWithStt>()

export default function TableMissing(prop: TableMissingProps) {
  const { data } = prop
  const [globalFilter, setGlobalFilter] = useState('')

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
      <TanstackTable table={table} title='Danh sách lỗi' />
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
