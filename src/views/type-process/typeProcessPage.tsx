'use client'

import { useMemo, useState } from 'react'

import { Button, Card, MenuItem, TablePagination } from '@mui/material'

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

import { toast } from 'react-toastify'

import PageHeader from '@/components/page-header'
import TableTypeProcess from './list'
import typeProcessService from '@/services/typeprocess.service'
import type { TypeProcessType } from '@/types/management/typeProcessType'
import RowAction from '@/components/rowAction'
import Iconify from '@/components/iconify'
import { fuzzyFilter } from '../apps/invoice/list/InvoiceListTable'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import AddTypeProcess from './addTypeProcess'
import { useTypeProcessStore } from '@/stores/typeprocess/typeProcess.store'
import UpdateTypeProcess from './updateTypeProcess'
import AlertDelete from '@/components/alertModal'

type TypeProcessWithAction = TypeProcessType & {
  stt?: number
  action?: string
}

const columnHelper = createColumnHelper<TypeProcessWithAction>()

export default function TypeProcessPage() {
  const { data, isLoading, mutate } = useSWR('/api/type-process', typeProcessService.getAll)
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState<boolean>(false)

  const {
    toogleAddTypeProcess,
    toogleUpdateTypeProcess,
    toogleDeleteTypeProcess,
    setTypeProcess,
    typeProcess,
    openDeleteTypeProcess
  } = useTypeProcessStore()

  const columns = useMemo<ColumnDef<TypeProcessWithAction, any>[]>(
    () => [
      columnHelper.accessor('stt', {
        header: 'STT',
        cell: info => info.row.index + 1,
        sortingFn: 'basic',
        meta: {
          width: '1'
        }
      }),
      columnHelper.accessor('typeProcessingId', {
        header: 'MÃ LOẠI XỬ LÝ',
        cell: info => info.getValue(),
        sortingFn: 'alphanumeric'
      }),
      columnHelper.accessor('typeProcessingName', {
        header: 'TÊN LOẠI XỬ LÝ',
        cell: info => info.getValue(),
        sortingFn: 'alphanumeric'
      }),
      columnHelper.accessor('action', {
        header: '',
        meta: {
          algin: 'right'
        },
        cell: infor => (
          <RowAction>
            <MenuItem
              onClick={() => {
                setTypeProcess(infor.row.original)
                toogleUpdateTypeProcess()
              }}
            >
              <Iconify icon='solar:pen-2-linear' />
              Sửa
            </MenuItem>
            <MenuItem
              onClick={() => {
                setTypeProcess(infor.row.original)
                toogleDeleteTypeProcess()
              }}
            >
              <Iconify icon='solar:trash-bin-2-linear' />
              Xóa
            </MenuItem>
          </RowAction>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
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

  const handleDelete = async () => {
    if (!typeProcess) {
      return
    }

    setLoading(true)
    const toastID = toast.loading('Đang xóa loại xử lý...')

    await typeProcessService.delete(
      typeProcess._id,
      () => {
        toast.update(toastID, {
          render: 'Xóa loại xử lý thành công',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        toogleDeleteTypeProcess()
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
      <PageHeader title='Danh sách loại xử lý' />
      <Card>
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
              onClick={toogleAddTypeProcess}
            >
              Thêm loại xử lý
            </Button>
          </div>
        </div>
        <TableTypeProcess table={table} loading={isLoading} />
        <TablePagination
          component={() => <TablePaginationComponent table={table as Table<unknown>} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex + 1}
          onPageChange={(_, page) => table.setPageIndex(page - 1)}
        />
      </Card>
      <AddTypeProcess mutate={mutate} />
      <UpdateTypeProcess mutate={mutate} />
      <AlertDelete
        open={openDeleteTypeProcess}
        onClose={toogleDeleteTypeProcess}
        content='Bạn có chắc chắn muốn xóa loại xử lý này không?'
        loading={loading}
        title='Xóa loại xử lý'
        onSubmit={handleDelete}
        cancelText='Hủy'
        submitText='Xóa'
      />
    </>
  )
}
