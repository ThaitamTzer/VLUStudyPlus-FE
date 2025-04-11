'use client'

import { useMemo, useState } from 'react'

import { Button, Card, IconButton, MenuItem, TablePagination, Tooltip } from '@mui/material'
import useSWR from 'swr'
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
import type { ColumnDef, SortingState, Table } from '@tanstack/react-table'

import { toast } from 'react-toastify'

import resultProcessService from '@/services/resultProcess.service'
import PageHeader from '@/components/page-header'
import TanstackTable from '@/components/TanstackTable'
import type { ProcessResultType } from '@/types/management/processResultType'
import Iconify from '@/components/iconify'
import { fuzzyFilter } from '../apps/invoice/list/InvoiceListTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'
import { useResultProcessStore } from '@/stores/resultProcess.store'
import AddProcessResult from './addprocessResult'
import UpdateProcessResult from './updateprocessResult'
import AlertDelete from '@/components/alertModal'

type ProcessResultWithAction = ProcessResultType & {
  stt?: number
  action?: string
}

const columnHelper = createColumnHelper<ProcessResultWithAction>()

export default function ProcessResultPage() {
  const { data, mutate, isLoading } = useSWR('/api/processing-result', resultProcessService.getAll)

  const {
    toogleAddResultProcess,
    toogleDeleteResultProcess,
    toolEditResultProcess,
    setResultProcessData,
    openDeleteResultProcess,
    resultProcessData
  } = useResultProcessStore()

  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState(false)

  const columns = useMemo<ColumnDef<ProcessResultWithAction, any>[]>(
    () => [
      columnHelper.accessor('stt', {
        header: 'STT',
        cell: infor => infor.row.index + 1,
        meta: {
          width: 1
        },
        enableSorting: false
      }),
      columnHelper.accessor('processingResultName', {
        header: 'Tên danh mục',
        cell: infor => infor.getValue(),
        sortingFn: 'alphanumeric'
      }),
      columnHelper.accessor('commitment', {
        header: 'Có làm đơn cam kết ?',
        cell: infor => (infor.getValue() ? 'Có' : 'Không'),
        sortingFn: 'alphanumeric'
      }),
      columnHelper.accessor('action', {
        header: '',
        meta: {
          align: 'right'
        },
        cell: infor => (
          <>
            <Tooltip title='Sửa danh mục'>
              <IconButton
                onClick={() => {
                  toolEditResultProcess()
                  setResultProcessData(infor.row.original)
                }}
              >
                <Iconify icon='solar:pen-2-linear' color='#2092ec' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Xóa danh mục'>
              <IconButton
                onClick={() => {
                  toogleDeleteResultProcess()
                  setResultProcessData(infor.row.original)
                }}
              >
                <Iconify icon='solar:trash-bin-2-linear' color='#ff0000' />
              </IconButton>
            </Tooltip>
          </>
        )
      })
    ],
    [setResultProcessData, toolEditResultProcess, toogleDeleteResultProcess]
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

  const onDelete = async () => {
    if (!resultProcessData) {
      return toast.error('Không tìm thấy kết quả xử lý')
    }

    const toastID = toast.loading('Đang xóa...')

    setLoading(true)

    await resultProcessService.delete(
      resultProcessData._id,
      () => {
        toast.update(toastID, {
          render: 'Xóa thành công',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        toogleDeleteResultProcess()
        mutate()
        setLoading(false)
      },
      err => {
        toast.update(toastID, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 2000
        })
        setLoading(false)
      }
    )
  }

  return (
    <>
      <PageHeader title='Danh sách danh mục kết quả xử lý học tập' />
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
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              className='max-sm:is-full'
              onClick={toogleAddResultProcess}
            >
              Thêm danh mục
            </Button>
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
      <AddProcessResult mutate={mutate} />
      <UpdateProcessResult mutate={mutate} />
      <AlertDelete
        open={openDeleteResultProcess}
        onClose={toogleDeleteResultProcess}
        onSubmit={onDelete}
        loading={loading}
        title='Xóa danh mục kết quả xử lý'
        content={
          <>
            Bạn có chắc chắn muốn xóa danh mục kết quả xử lý <strong>{resultProcessData?.processingResultName}</strong>?
          </>
        }
      />
    </>
  )
}
