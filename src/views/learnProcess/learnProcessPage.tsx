'use client'
import { useMemo, useState } from 'react'

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

import { Button, Card, IconButton, MenuItem, TablePagination, Tooltip } from '@mui/material'

import { toast } from 'react-toastify'

import learnProcessService from '@/services/learnProcess.service'
import type { LearnProcessType } from '@/types/management/learnProcessType'
import RowAction from '@/components/rowAction'
import Iconify from '@/components/iconify'
import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import { fuzzyFilter } from '../apps/invoice/list/InvoiceListTable'
import PageHeader from '@/components/page-header'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import TableTypeProcess from '../type-process/list'
import AddAcedemicProcess from './addAcedemicProcess'
import UpdateAcedemicProcess from './updateAcedemicProcess'
import AlertDelete from '@/components/alertModal'
import ImportModal from './importModal'
import ImportResult from './importResult'
import ManualAddAcedemicProcess from './manualAddAcedemicProcess'

type AcedemicProcessWithAction = LearnProcessType & {
  stt?: number
  action?: string
}

const columnHelper = createColumnHelper<AcedemicProcessWithAction>()

export default function LearnProcessPage() {
  const { data, mutate, isLoading } = useSWR('/api/learnProcess', learnProcessService.getAll)

  const {
    toogleAddAcedemicProcess,
    setAcedemicProcess,
    toogleUpdateAcedemicProcess,
    toogleDeleteAcedemicProcess,
    acedemicProcess,
    openDeleteAcedemicProcess,
    toogleImportModal,
    toogleManualAdd
  } = useAcedemicProcessStore()

  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState<boolean>(false)

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
        header: 'Tiêu đề',
        cell: infor => infor.getValue(),
        sortingFn: 'alphanumeric'
      }),
      columnHelper.accessor('action', {
        header: '',
        meta: {
          algin: 'right'
        },
        cell: infor => (
          <>
            <Tooltip title='Thêm xử lý học tập' arrow>
              <IconButton
                onClick={() => {
                  toogleManualAdd()
                  setAcedemicProcess(infor.row.original)
                }}
              >
                <Iconify icon='ic:twotone-add' color='green' />
              </IconButton>
            </Tooltip>
            <Tooltip title='Import danh sách xử lý học tập' arrow>
              <IconButton
                onClick={() => {
                  toogleImportModal()
                  setAcedemicProcess(infor.row.original)
                }}
              >
                <Iconify icon='bx:import' color='green' />
              </IconButton>
            </Tooltip>
            <RowAction>
              <MenuItem
                onClick={() => {
                  setAcedemicProcess(infor.row.original)
                  toogleUpdateAcedemicProcess()
                }}
              >
                <Iconify icon='solar:pen-2-linear' />
                Sửa
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAcedemicProcess(infor.row.original)
                  toogleDeleteAcedemicProcess()
                }}
              >
                <Iconify icon='solar:trash-bin-2-linear' />
                Xóa
              </MenuItem>
            </RowAction>
          </>
        ),
        enableSorting: false
      })
    ],
    [setAcedemicProcess, toogleUpdateAcedemicProcess, toogleDeleteAcedemicProcess, toogleImportModal]
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
    if (!acedemicProcess) {
      return
    }

    const toastID = toast.loading('Đang xóa...')

    setLoading(true)

    await learnProcessService.delete(
      acedemicProcess?._id,
      () => {
        toast.update(toastID, {
          render: 'Xóa thành công',
          type: 'success',
          isLoading: false,
          autoClose: 2000
        })
        toogleDeleteAcedemicProcess()
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
        toogleDeleteAcedemicProcess()
      }
    )
  }

  return (
    <>
      <PageHeader title='Danh sách xử lý học tập' />
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
              onClick={toogleAddAcedemicProcess}
            >
              Thêm kỳ xử lý học tập
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
      <AddAcedemicProcess mutate={mutate} />
      <ManualAddAcedemicProcess mutate={mutate} />
      <UpdateAcedemicProcess mutate={mutate} />
      <ImportModal mutate={mutate} />
      <ImportResult />
      <AlertDelete
        open={openDeleteAcedemicProcess}
        onClose={toogleDeleteAcedemicProcess}
        loading={loading}
        title='Xóa xử lý học tập'
        onSubmit={onDelete}
        content={`Bạn có chắc chắn muốn xóa xử lý học tập "${acedemicProcess?.title}" không?`}
        cancelText='Hủy'
        submitColor='error'
        submitText='Xóa'
      />
    </>
  )
}
