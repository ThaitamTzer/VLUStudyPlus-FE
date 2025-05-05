'use client'

import { useCallback, useMemo, useState } from 'react'

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

import type { SortingState, Table, ColumnDef } from '@tanstack/react-table'

import { Avatar, Stack, TablePagination, Typography } from '@mui/material'

import useSWR from 'swr'

import { CustomDialog } from '@/components/CustomDialog'
import { useClassStore } from '@/stores/class/class'
import TanstackTable from '@/components/TanstackTable'
import type { ListStudentByClass } from '@/types/management/classType'
import classService from '@/services/class.service'

import { fDate } from '@/utils/format-time'
import IsBlock from '@/views/student/isBlock'
import { fuzzyFilter } from '@/views/apps/invoice/list/InvoiceListTable'
import TablePaginationComponent from '@/components/TablePaginationComponent'

type ListStudentByClassWithNo = ListStudentByClass & {
  no?: number
}

const columnHelper = createColumnHelper<ListStudentByClassWithNo>()

const UserInfor = (data: ListStudentByClass) => {
  return (
    <Stack direction='row' spacing={2} alignItems='center'>
      <Avatar
        alt={data.userName}
        src={data.avatar}
        sx={{
          width: 35,
          height: 35
        }}
      >
        {data.userName}
      </Avatar>
      <Stack spacing={1}>
        {data.userId} - {data.userName} - {data.classCode}
        <Typography variant='caption'>{data.mail}</Typography>
      </Stack>
    </Stack>
  )
}

export default function ViewListStudentByClass() {
  const { toogleOpenViewListStudentModal, openViewListStudentModal, classRoom } = useClassStore()
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const id = classRoom?.classId || ''

  const { data, isLoading } = useSWR(
    id ? `/api/student/view-list-student-for-class/${id}` : null,
    () => classService.getListStudentByClass(id),
    {
      revalidateOnMount: true
    }
  )

  const onClose = useCallback(() => {
    toogleOpenViewListStudentModal()
  }, [toogleOpenViewListStudentModal])

  const columns = useMemo<ColumnDef<ListStudentByClassWithNo, any>[]>(
    () => [
      columnHelper.accessor('no', {
        header: 'STT',
        cell: infor => infor.row.index + 1,
        meta: {
          width: 1
        },
        enableSorting: false
      }),

      columnHelper.display({
        id: 'userInfor',
        header: 'Sinh viên',
        cell: infor => UserInfor(infor.row.original),
        meta: {
          width: 300
        }
      }),

      columnHelper.accessor('classCode', {
        header: 'Khóa',
        cell: infor => infor.getValue(),
        meta: {
          width: 100
        }
      }),

      columnHelper.accessor('dateOfBirth', {
        header: 'Ngày sinh',
        cell: infor => fDate(infor.getValue(), 'dd/MM/yyyy'),
        meta: {
          width: 100
        }
      }),
      columnHelper.accessor('isBlock', {
        header: 'Trạng thái',
        cell: infor => IsBlock({ isBlock: infor.getValue() }),
        meta: {
          width: 100
        }
      })
    ],
    []
  )

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting, globalFilter },
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

  const dialog = useMemo(
    () => (
      <CustomDialog
        open={openViewListStudentModal}
        onClose={onClose}
        title={`Danh sách sinh viên lớp ${classRoom?.classId}`}
        maxWidth='lg'
        fullWidth
      >
        <TanstackTable minWidth={900} table={table} loading={isLoading} title='Không tìm thấy sinh viên nào' />
        <TablePagination
          component={() => <TablePaginationComponent table={table as Table<unknown>} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex + 1}
          onPageChange={(_, page) => table.setPageIndex(page - 1)}
        />
      </CustomDialog>
    ),
    [openViewListStudentModal, onClose, classRoom?.classId, table, isLoading]
  )

  return <>{dialog}</>
}
