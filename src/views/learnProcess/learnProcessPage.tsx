'use client'
import { useState } from 'react'

import dynamic from 'next/dynamic'

import useSWR from 'swr'

import type { SortingState, Table } from '@tanstack/react-table'
import {
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import { Button, Card, MenuItem, TablePagination, Typography } from '@mui/material'

import { toast } from 'react-toastify'

import learnProcessService from '@/services/learnProcess.service'
import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import { fuzzyFilter } from '../apps/invoice/list/InvoiceListTable'
import PageHeader from '@/components/page-header'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import ProgressModal from './progressModal'
import { useColumns } from './viewAcedemicProcess/columns'

const TableTypeProcess = dynamic(() => import('../type-process/list'), { ssr: false })
const AddAcedemicProcess = dynamic(() => import('./addAcedemicProcess'), { ssr: false })
const UpdateAcedemicProcess = dynamic(() => import('./updateAcedemicProcess'), { ssr: false })
const AlertDelete = dynamic(() => import('@/components/alertModal'), { ssr: false })
const ImportModal = dynamic(() => import('./importModal'), { ssr: false })
const ImportResult = dynamic(() => import('./importResult'), { ssr: false })
const ManualAddAcedemicProcess = dynamic(() => import('./manualAddAcedemicProcess'), { ssr: false })
const ViewAcedemicProcess = dynamic(() => import('./viewAcedemicProcess/viewAcedemicProcess'), { ssr: false })

export default function LearnProcessPage() {
  const columns = useColumns()

  const {
    toogleAddAcedemicProcess,
    toogleDeleteAcedemicProcess,
    acedemicProcess,
    openDeleteAcedemicProcess,
    toogleManualAdd,
    openManualAdd,
    openProgress,
    setListAcedemicProcess
  } = useAcedemicProcessStore()

  const { data, mutate, isLoading } = useSWR('/api/learnProcess', learnProcessService.getAll, {
    onSuccess: data => {
      if (data) {
        setListAcedemicProcess(data)
      }
    },
    revalidateOnFocus: false
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState<boolean>(false)

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

    await learnProcessService.deleteAll(
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
      <PageHeader title='Danh sách kỳ xử lý học tập' />
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
      <ManualAddAcedemicProcess mutate={mutate} open={openManualAdd} onClose={toogleManualAdd} />
      <UpdateAcedemicProcess mutate={mutate} />
      <ImportModal mutate={mutate} />
      <ImportResult />
      <ViewAcedemicProcess />
      <ProgressModal open={openProgress} />
      <AlertDelete
        countdown
        open={openDeleteAcedemicProcess}
        onClose={toogleDeleteAcedemicProcess}
        loading={loading}
        title='Xóa xử lý học tập'
        onSubmit={onDelete}
        content={
          <Typography variant='h6'>
            Bạn có chắc chắn muốn xóa xử lý học tập {acedemicProcess?.title} không?.
            <br />
            <strong className='text-red-600'>
              Khi xóa, tất cả dữ liệu liên quan đến kỳ xử lý học tập này sẽ bị xóa.
            </strong>
          </Typography>
        }
        cancelText='Hủy'
        submitColor='error'
        submitText='Xóa'
      />
    </>
  )
}
