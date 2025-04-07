'use client'
import { useMemo, useState } from 'react'

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

import { Box, Button, Card, CardContent, MenuItem, TablePagination, Typography } from '@mui/material'

import { toast } from 'react-toastify'

import learnProcessService from '@/services/learnProcess.service'
import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import { fuzzyFilter } from '../apps/invoice/list/InvoiceListTable'
import PageHeader from '@/components/page-header'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import ProgressModal from '../../components/dialogs/progressModal'
import { useColumns } from './viewAcedemicProcess/columns'
import ViewCommitmentForms from '../commitmentForms/viewCommitmentForm'
import ViewCommitmentFormsOfCVHT from '../commitmentForms/viewCommitmentFormOfCVHT'
import Iconify from '@/components/iconify'

// import { useAbility } from '@/hooks/useAbility'

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

  // const ability = useAbility()

  const {
    toogleAddAcedemicProcess,
    toogleDeleteAcedemicProcess,
    acedemicProcess,
    openDeleteAcedemicProcess,
    toogleManualAdd,
    openManualAdd,
    openProgress,
    setAcedemicProcess,
    isCompleted,
    isProcessing,
    toogleProgress,
    toogleImportResultModal
  } = useAcedemicProcessStore()

  const { data, mutate, isLoading } = useSWR('/api/learnProcess', learnProcessService.getAll, {
    revalidateOnFocus: false,
    onSuccess: data => {
      if (data) {
        const found = data.find(item => item._id === acedemicProcess?._id)

        if (found) {
          setAcedemicProcess(found)
        }
      }
    }
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

  const renderTable = useMemo(
    () => (
      <>
        <TableTypeProcess table={table} loading={isLoading} />
        <TablePagination
          component={() => <TablePaginationComponent table={table as Table<unknown>} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex + 1}
          onPageChange={(_, page) => table.setPageIndex(page - 1)}
        />
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [table, isLoading, data]
  )

  return (
    <>
      <PageHeader title='Danh sách kỳ xử lý học tập' />
      <Card sx={{ mt: 4, boxShadow: 5 }}>
        <CardContent>
          <Typography variant='h6' fontWeight='bold' gutterBottom>
            Hướng dẫn thao tác
          </Typography>
          <Box display='grid' gridTemplateColumns='repeat(auto-fit, minmax(150px, 1fr))' gap={2}>
            {[
              { icon: 'mingcute:information-fill', color: '#2092ec', label: 'Xem danh sách xử lý học tập' },
              { icon: 'hugeicons:files-01', color: '#8e44ad', label: 'Xem danh sách đơn cam kết' },
              { icon: 'tabler:file-import', color: 'green', label: 'Import danh sách xử lý học tập' },
              { icon: 'solar:pen-2-linear', color: 'orange', label: 'Cập nhật kỳ xử lý' },
              { icon: 'solar:trash-bin-2-linear', color: 'red', label: 'Xóa kỳ xử lý' }
            ].map((item, index) => (
              <Box
                key={index}
                display='flex'
                alignItems='center'
                gap={1}
                sx={{
                  p: 2,
                  borderRadius: '8px',
                  boxShadow: 5,
                  transition: 'all 0.3s',
                  '&:hover': { boxShadow: 3 }
                }}
              >
                <Iconify icon={item.icon} color={item.color} width={24} height={24} />
                <Typography variant='body2' fontWeight='500'>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
          <Typography variant='h6' fontWeight='bold' gutterBottom sx={{ mt: 4 }}>
            Thêm xử lý học vụ
          </Typography>
          <Typography variant='body1' gutterBottom>
            Bạn có thể thêm xử lý học tập bằng cách xem danh sách xử lý học tập và chọn Thêm XLHV.
          </Typography>
        </CardContent>
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
            {/* {ability && ability.can && ability.can('create', 'casca') && ( */}
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              className='max-sm:is-full'
              onClick={toogleAddAcedemicProcess}
            >
              Thêm kỳ XLHT
            </Button>
            {/* )} */}
          </div>
        </div>
        {renderTable}
      </Card>
      <AddAcedemicProcess mutate={mutate} />
      <ManualAddAcedemicProcess mutate={mutate} open={openManualAdd} onClose={toogleManualAdd} />
      <UpdateAcedemicProcess mutate={mutate} />
      <ImportModal mutate={mutate} />
      <ImportResult />
      <ViewAcedemicProcess listAcedemicProcess={data || []} />
      <ViewCommitmentForms />
      <ViewCommitmentFormsOfCVHT />
      <ProgressModal
        open={openProgress}
        isCompleted={isCompleted}
        isProcessing={isProcessing}
        openEnded={toogleImportResultModal}
        onClose={toogleProgress}
      />
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
