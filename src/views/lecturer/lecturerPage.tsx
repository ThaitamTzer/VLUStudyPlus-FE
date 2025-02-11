'use client'

import { useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import useSWR from 'swr'

import { Button, Card, MenuItem, TablePagination } from '@mui/material'

import { Flip, toast } from 'react-toastify'

import lecturerService from '@/services/lecturer.service'
import PageHeader from '@/components/page-header'
import DebouncedInput from '@/components/debouncedInput'
import CustomTextField from '@/@core/components/mui/TextField'
import LecturerList from './lecturerList'
import TablePaginationCustom from '@/components/table/TablePagination'
import { useLecturerStore } from '@/stores/lecturer/lecturer'
import AddLecturer from './addLecturer'
import UpdateLecturer from './updateLecturer'
import AlertBlock from '@/components/alertModal'

export default function LecturerPage() {
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  const {
    toogleAddLecturer,
    lecturer,
    openBlockLecturer,
    openUnBlockLecturer,
    toogleBlockLecturer,
    toogleUnBlockLecturer
  } = useLecturerStore()

  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10
  const filterField = searchParams.get('filterField') || ''
  const filterValue = searchParams.get('filterValue') || ''
  const searchKey = searchParams.get('searchKey') || ''

  const fetcher = ['/api/lecturer', page, limit, filterField, filterValue, searchKey]

  const { data, isLoading, mutate } = useSWR(fetcher, () =>
    lecturerService.getAll(page, limit, filterField, filterValue, searchKey)
  )

  const onBlock = async () => {
    if (!lecturer) {
      return
    }

    setLoading(true)

    const toastId = toast.loading('Đang thực hiện...')

    await lecturerService.block(
      lecturer?._id,
      true,
      () => {
        toogleBlockLecturer()
        toast.update(toastId, {
          render: 'Khóa thành công',
          type: 'success',
          autoClose: 2000,
          isLoading: false,
          transition: Flip
        })
        mutate()
        setLoading(false)
      },
      err => {
        toast.update(toastId, {
          render: err.message,
          type: 'error',
          autoClose: 2000,
          isLoading: false,
          transition: Flip
        })
        setLoading(false)
      }
    )
  }

  const onUnBlock = async () => {
    if (!lecturer) {
      return
    }

    setLoading(true)

    const toastId = toast.loading('Đang thực hiện...')

    await lecturerService.block(
      lecturer?._id,
      false,
      () => {
        toogleUnBlockLecturer()
        toast.update(toastId, {
          render: 'Mở khóa thành công',
          type: 'success',
          autoClose: 2000,
          isLoading: false,
          transition: Flip
        })
        mutate()
        setLoading(false)
      },
      err => {
        toast.update(toastId, {
          render: err.message,
          type: 'error',
          autoClose: 2000,
          isLoading: false,
          transition: Flip
        })
        setLoading(false)
      }
    )
  }

  return (
    <>
      <PageHeader title='Danh sách cán bộ giảng viên' />
      <Card
        sx={{
          mt: 4
        }}
      >
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            className='max-sm:is-full sm:is-[80px]'
            value={limit}
            onChange={e => {
              const params = new URLSearchParams()

              params.set('page', '1')
              params.set('limit', e.target.value)

              if (searchKey) {
                params.set('searchKey', searchKey)
              }

              router.push(`?${params.toString()}`)
            }}
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <div className='flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4'>
            <DebouncedInput
              value={searchKey}
              onChange={value => {
                const params = new URLSearchParams()

                params.set('page', '1')
                params.set('limit', limit.toString())

                if (value) {
                  params.set('searchKey', value as string)
                }

                router.push(`?${params.toString()}`)
              }}
              placeholder='Tìm kiếm'
              className='max-sm:is-full sm:is-[300px]'
              SelectProps={{}}
            />
            <Button
              onClick={toogleAddLecturer}
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              className='max-sm:is-full'
            >
              Thêm CBGV
            </Button>
          </div>
        </div>
        <LecturerList
          lecturers={data?.lecturers || []}
          page={page}
          limit={limit}
          loading={isLoading}
          total={data?.pagination.totalItems || 0}
        />
        <TablePagination
          component={() => (
            <TablePaginationCustom
              data={data?.lecturers || []}
              page={page}
              limit={limit}
              total={data?.pagination.totalItems || 0}
              searchKey={searchKey}
            />
          )}
          count={data?.pagination.totalItems || 0}
          page={page - 1}
          rowsPerPage={limit}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={(_, page) => {
            const params = new URLSearchParams()

            params.set('page', page.toString())
            params.set('limit', limit.toString())

            if (searchKey) {
              params.set('searchKey', searchKey)
            }

            router.push(`?${params.toString()}`, {
              scroll: false
            })
          }}
        />
      </Card>
      <AddLecturer mutate={mutate} />
      <UpdateLecturer mutate={mutate} />
      <AlertBlock
        title='Xác nhận khóa'
        content={
          <div className='space-y-4'>
            <p>
              Bạn có chắc chắn muốn khóa giảng viên <strong>{lecturer?.userName}</strong> với mã giảng viên là{' '}
              <strong>{lecturer?.userId}</strong> không?
            </p>
            <p className='text-red-500'>
              <strong>Lưu ý:</strong> Giảng viên sẽ không thể truy cập vào hệ thống nếu bạn khóa tài khoản của họ.
            </p>
          </div>
        }
        loading={loading}
        open={openBlockLecturer}
        onClose={toogleBlockLecturer}
        cancelText='Hủy'
        submitText='Khóa'
        onSubmit={onBlock}
        submitColor='error'
      />
      <AlertBlock
        title='Xác nhận mở khóa'
        content={
          <div className='space-y-4'>
            <p>
              Bạn có chắc chắn muốn mở khóa giảng viên <strong>{lecturer?.userName}</strong> với mã giảng viên là{' '}
              <strong>{lecturer?.userId}</strong> không?
            </p>
          </div>
        }
        loading={loading}
        open={openUnBlockLecturer}
        onClose={toogleUnBlockLecturer}
        cancelText='Hủy'
        submitText='Mở khóa'
        onSubmit={onUnBlock}
        submitColor='primary'
      />
    </>
  )
}
