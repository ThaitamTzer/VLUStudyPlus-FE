'use client'

import { useMemo, useState } from 'react'

import { Card, Divider, IconButton, MenuItem, TablePagination, Tooltip } from '@mui/material'

import useSWR from 'swr'

import type { ColumnDef, SortingState, Table } from '@tanstack/react-table'
import {
  createColumnHelper,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import PageHeader from '@/components/page-header'
import learnProcessService from '@/services/learnProcess.service'
import type { LearnProcessType } from '@/types/management/learnProcessType'
import Iconify from '@/components/iconify'
import { fuzzyFilter } from '../apps/invoice/list/InvoiceListTable'
import TanstackTable from '@/components/TanstackTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import { useCommitmentStore } from '@/stores/commitment.store'
import ViewCommitmentForms from './viewCommitmentForm'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'

type AcedemicProcessWithAction = LearnProcessType & {
  stt?: number
  action?: string
}

const columnHelper = createColumnHelper<AcedemicProcessWithAction>()

export default function CommitmentFormsPage() {
  const { toogleViewByCategory, setAcedemicProcess } = useCommitmentStore()

  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const { data, isLoading } = useSWR('/processing-period', learnProcessService.getAll)

  const columns = useMemo<ColumnDef<AcedemicProcessWithAction, any>[]>(
    () => [
      columnHelper.accessor('stt', {
        header: 'STT',
        cell: infor => infor.row.index + 1,
        meta: {
          width: 1
        },
        enableSorting: false
      }),
      columnHelper.accessor('title', {
        header: 'Kỳ xử lý',
        cell: infor => infor.getValue(),
        sortingFn: 'alphanumeric'
      }),
      columnHelper.accessor('action', {
        header: '',
        meta: {
          algin: 'left'
        },
        cell: infor => (
          <>
            <Tooltip title='Xem danh sách đơn cam kết của kỳ này' arrow>
              <IconButton
                onClick={() => {
                  setAcedemicProcess(infor.row.original)
                  toogleViewByCategory()
                }}
              >
                <Iconify icon='mdi:eye' color='#2092ec' />
              </IconButton>
            </Tooltip>
          </>
        )
      })
    ],
    [setAcedemicProcess, toogleViewByCategory]
  )

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, globalFilter },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    onSortingChange: setSorting,
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
      <PageHeader title='Danh sách đơn cam kết' />
      <Divider
        sx={{
          margin: '10px 0px'
        }}
      />
      <Card sx={{ mt: 4 }}>
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
          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Tìm kiếm'
              className='max-sm:is-full'
            />
          </div>
        </div>
        <TanstackTable table={table} loading={isLoading} />
        <TablePagination
          component={() => <TablePaginationComponent table={table as Table<unknown>} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex + 1}
          onPageChange={(_, page) => table.setPageIndex(page - 1)}
        />
      </Card>
      <ViewCommitmentForms />
    </>
  )
}
