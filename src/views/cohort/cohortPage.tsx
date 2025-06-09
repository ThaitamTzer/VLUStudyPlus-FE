'use client'

import { useMemo, useState } from 'react'

import { Button, Card, IconButton, MenuItem, TablePagination } from '@mui/material'
import useSWR from 'swr'
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues
} from '@tanstack/react-table'

import type { ColumnDef, SortingState, Table } from '@tanstack/react-table'

import { toast } from 'react-toastify'

import PageHeader from '@/components/page-header'
import cohortService from '@/services/cohort.service'
import { useCohortStore } from '@/stores/cohort/cohort'
import type { Cohort } from '@/types/management/cohortType'
import Iconify from '@/components/iconify'
import { fuzzyFilter } from '../apps/invoice/list/InvoiceListTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import CohortList from './cohortList'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'
import AddCohort from './addCohort'
import RowAction from '@/components/rowAction'
import UpdateCohort from './updateCohort'
import AlertDelete from '@/components/alertModal'
import ViewCohort from './viewCohort'

type CohortTypeWithAction = Cohort & {
  stt?: number
  action?: string
}

const columnHelper = createColumnHelper<CohortTypeWithAction>()

export default function CohortPage() {
  const {
    setCohorts,
    toogleAddCohort,
    toogleUpdateCohort,
    setCohort,
    cohort,
    toogleDeleteCohort,
    openDeleteCohort,
    toogleViewCohort
  } = useCohortStore()

  const { mutate, data: cohorts } = useSWR('/api/cohort', cohortService.getAll, {
    onSuccess: data => {
      setCohorts(data)
    }
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState<boolean>(false)

  const columns = useMemo<ColumnDef<CohortTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('stt', {
        header: 'STT',
        cell: info => info.row.index + 1,
        sortingFn: 'basic',
        meta: {
          width: '1'
        }
      }),
      columnHelper.accessor('cohortId', {
        header: 'Mã niên khóa',
        cell: info => info.getValue(),
        sortingFn: 'alphanumeric'
      }),
      columnHelper.accessor('cohortName', {
        header: 'Tên niên khóa',
        cell: info => info.getValue(),
        sortingFn: 'alphanumeric'
      }),
      columnHelper.accessor('startYear', {
        header: 'Năm bắt đầu',
        cell: info => info.getValue(),
        sortingFn: 'basic'
      }),
      columnHelper.accessor('endYear', {
        header: 'Năm kết thúc',
        cell: info => info.getValue(),
        sortingFn: 'basic'
      }),
      columnHelper.accessor('action', {
        header: '',
        meta: {
          align: 'right'
        },
        cell: infor => (
          <>
            <IconButton
              onClick={() => {
                toogleViewCohort()
                setCohort(infor.row.original)
              }}
            >
              <Iconify icon='solar:eye-bold-duotone' />
            </IconButton>
            <RowAction>
              <MenuItem
                onClick={() => {
                  toogleUpdateCohort()
                  setCohort(infor.row.original)
                }}
              >
                <Iconify icon='solar:pen-2-linear' />
                Sửa
              </MenuItem>
              <MenuItem
                onClick={() => {
                  toogleDeleteCohort()
                  setCohort(infor.row.original)
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
    [toogleUpdateCohort, setCohort, toogleDeleteCohort, toogleViewCohort]
  )

  const handleDelete = async () => {
    if (!cohort) {
      return
    }

    const toastId = toast.loading('Xóa niên khóa...')

    setLoading(true)
    await cohortService.delete(
      cohort._id,
      () => {
        toogleDeleteCohort()
        mutate()
        toast.update(toastId, {
          render: 'Xóa niên khóa thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
        setLoading(false)
      },
      err => {
        toogleDeleteCohort()
        setLoading(false)
        toast.update(toastId, {
          render: err.message || 'Xóa niên khóa thất bại',
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
      }
    )
  }

  const table = useReactTable({
    data: cohorts || [],
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
      <PageHeader title='Danh sách niên khóa' />
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
              onClick={toogleAddCohort}
            >
              Thêm niên khóa
            </Button>
          </div>
        </div>
        <CohortList table={table} />
        <TablePagination
          component={() => <TablePaginationComponent table={table as Table<unknown>} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex + 1}
          onPageChange={(_, page) => table.setPageIndex(page - 1)}
        />
      </Card>
      <AddCohort mutate={mutate} />
      <UpdateCohort mutate={mutate} />
      <ViewCohort />
      <AlertDelete
        open={openDeleteCohort}
        onClose={toogleDeleteCohort}
        content='Bạn có chắc chắn muốn xóa niên khóa này không?'
        loading={loading}
        title='Xóa niên khóa'
        onSubmit={handleDelete}
        cancelText='Hủy'
        submitText='Xóa'
      />
    </>
  )
}
