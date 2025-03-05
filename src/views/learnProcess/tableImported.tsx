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
    <>
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
    </>
  )
}
