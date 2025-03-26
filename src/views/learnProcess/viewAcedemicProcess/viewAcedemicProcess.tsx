'use client'
import { useCallback, useState } from 'react'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Card,
  MenuItem,
  TablePagination,
  Button
} from '@mui/material'
import useSWR from 'swr'

import { toast } from 'react-toastify'

import { useAcedemicProcessStore } from '@/stores/acedemicProcess.store'
import learnProcessService from '@/services/learnProcess.service'
import Iconify from '@/components/iconify'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'
import TablePaginationCustomNoURL from '@/components/table/TablePaginationNoURL'
import { useShare } from '@/hooks/useShare'
import ManualAddAcedemicProcess from '../manualAddAcedemicProcess'
import TableAcedemicProcess from './tableAcedemicProcess'
import TableFilter from './tableFilter'
import ManualEditAcedemicProcess from './editAcedemicProcess'
import AlertDelete from '@/components/alertModal'
import ViewDetailAcedecmicProcess from './viewDetailAcedemicProcess'
import UpdateAcedemicProcessStatus from '../updateAcedemicProcessStatus'
import type { LearnProcessType } from '@/types/management/learnProcessType'
import SendMailModal from './sendMailModal'
import SendMailModalRemind from './sendMailModalRemind'

export default function ViewAcedemicProcess({ listAcedemicProcess }: { listAcedemicProcess: LearnProcessType[] }) {
  const {
    openViewByCategory,
    toogleViewByCategory,
    acedemicProcess,
    setAcedemicProcess,
    toogleManualAddFromViewByCate,
    openManualAddFromViewByCate,
    toogleEditViewAcedemicProcess,
    openEditViewAcedemicProcess,
    setProcessing,
    toogleDeleteViewAcedemicProcess,
    openDeleteViewAcedemicProcess,
    processing,
    toogleViewDetailAcademicProcess,
    toogleUpdateAcedemicProcessStatus,
    tooogleSendEmail,
    toogleSendEmailRemind
  } = useAcedemicProcessStore()

  const { cohorOptions } = useShare()

  const id = acedemicProcess?._id

  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [filterField, setFilterField] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [searchKey, setSearchKey] = useState('')
  const [loading, setLoading] = useState(false)

  const fetcher = [`/api/acedemicProcess/${id}`, page, limit, filterField, filterValue, sortField, sortOrder, searchKey]

  const { data, isLoading, mutate } = useSWR(id ? fetcher : null, () =>
    learnProcessService.viewProcessByCategory(
      id as string,
      page,
      limit,
      filterField,
      filterValue,
      sortField,
      sortOrder,
      searchKey
    )
  )

  const { data: classList } = useSWR(id ? 'classListInProcess' : null, () =>
    learnProcessService.getListClassInProcess(id as string)
  )

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortOrder === 'asc'
    const newSortOrder = isAsc ? 'desc' : 'asc'

    setSortField(field)
    setSortOrder(newSortOrder)
    setPage(1)
  }

  const onDelete = useCallback(async () => {
    if (!processing) return toast.error('Không có dữ liệu để xóa')
    const toastId = toast.loading('Đang xóa dữ liệu')

    setLoading(true)
    await learnProcessService.deleteProcess(
      processing._id,
      () => {
        setLoading(false)
        mutate()
        toogleDeleteViewAcedemicProcess()
        toast.update(toastId, {
          render: 'Xóa dữ liệu thành công',
          type: 'success',
          isLoading: false,
          autoClose: 3000
        })
      },
      err => {
        setLoading(false)
        toast.update(toastId, {
          render: err.message,
          type: 'error',
          isLoading: false,
          autoClose: 3000
        })
      }
    )
  }, [processing, mutate, toogleDeleteViewAcedemicProcess])

  const handleClose = () => {
    toogleViewByCategory()
    setPage(1)
    setLimit(10)
    setFilterField('')
    setFilterValue('')
    setSortField('')
    setSortOrder('asc')
    setSearchKey('')
    setAcedemicProcess({} as any)
  }

  return (
    <>
      <Dialog open={openViewByCategory} maxWidth='xl' onClose={handleClose} fullScreen>
        <DialogTitle>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <Iconify icon='mdi:close' color='black' />
          </IconButton>
          <Typography
            variant='h4'
            sx={{
              textTransform: 'uppercase'
            }}
          >
            Danh sách {acedemicProcess?.title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Card>
            <TableFilter
              cohorOptions={cohorOptions}
              setPage={setPage}
              setFilterField={setFilterField}
              setFilterValue={setFilterValue}
            />
            <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
              <CustomTextField
                select
                className='max-sm:is-full sm:is-[80px]'
                value={limit}
                onChange={e => {
                  setLimit(Number(e.target.value))
                  setPage(1)
                }}
              >
                <MenuItem value='10'>10</MenuItem>
                <MenuItem value='25'>25</MenuItem>
                <MenuItem value='50'>50</MenuItem>
              </CustomTextField>
              <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
                <DebouncedInput
                  value={searchKey}
                  fullWidth
                  onChange={value => {
                    setSearchKey(value as string)
                    setPage(1)
                  }}
                  placeholder='Tìm kiếm'
                  className='max-sm:is-full sm:is-[300px]'
                />
                {!acedemicProcess?.isNotification ? (
                  <Button
                    disabled={data?.pagination.totalItems === 0}
                    onClick={tooogleSendEmail}
                    variant='contained'
                    startIcon={<Iconify icon='fluent-emoji-flat:bell' />}
                    className='max-sm:is-full'
                  >
                    Thông báo XLHV GV-SV
                  </Button>
                ) : (
                  <Button
                    disabled={data?.pagination.totalItems === 0}
                    variant='contained'
                    onClick={toogleSendEmailRemind}
                    startIcon={<Iconify icon='fluent-emoji-flat:bell' />}
                    className='max-sm:is-full'
                  >
                    Gửi email nhắc nhở
                  </Button>
                )}
                <Button
                  onClick={toogleManualAddFromViewByCate}
                  variant='contained'
                  startIcon={<i className='tabler-plus' />}
                  className='max-sm:is-full'
                >
                  Thêm XLHV
                </Button>
              </div>
            </div>
            <TableAcedemicProcess
              data={data}
              isLoading={isLoading}
              page={page}
              limit={limit}
              sortField={sortField}
              sortOrder={sortOrder}
              handleSort={handleSort}
              setProcessing={setProcessing}
              toogleEditViewAcedemicProcess={toogleEditViewAcedemicProcess}
              toogleDeleteViewAcedemicProcess={toogleDeleteViewAcedemicProcess}
              toogleViewDetailAcedemicProcess={toogleViewDetailAcademicProcess}
              toogleOpenUpdateAcedemicProcessStatus={toogleUpdateAcedemicProcessStatus}
            />
            <TablePagination
              component={() => (
                <TablePaginationCustomNoURL
                  data={data?.data || []}
                  page={page}
                  limit={limit}
                  total={data?.pagination.totalItems || 0}
                  setPage={setPage}
                />
              )}
              count={data?.pagination.totalItems || 0}
              page={page - 1}
              rowsPerPage={limit}
              rowsPerPageOptions={[10, 25, 50]}
              onPageChange={(_, newPage) => {
                setPage(newPage + 1)
              }}
            />
          </Card>
        </DialogContent>
      </Dialog>
      <ViewDetailAcedecmicProcess id={processing?._id || ''} />
      <UpdateAcedemicProcessStatus mutate={mutate} />
      <ManualEditAcedemicProcess
        mutate={mutate}
        listAcedemicProcess={listAcedemicProcess}
        onClose={toogleEditViewAcedemicProcess}
        open={openEditViewAcedemicProcess}
      />
      <ManualAddAcedemicProcess
        mutate={mutate}
        onClose={toogleManualAddFromViewByCate}
        open={openManualAddFromViewByCate}
      />
      <SendMailModal id={acedemicProcess?._id || ''} mutate={mutate} />
      <SendMailModalRemind classList={classList || ({} as any)} id={acedemicProcess?._id || ''} />
      <AlertDelete
        open={openDeleteViewAcedemicProcess}
        onClose={toogleDeleteViewAcedemicProcess}
        content={`Bạn có chắc chắn muốn xóa xữ lý học tập của sinh viên ${processing?.firstName} ${processing?.lastName} không?`}
        onSubmit={onDelete}
        title='Xóa xữ lý học tập'
        submitColor='error'
        loading={loading}
      />
    </>
  )
}
