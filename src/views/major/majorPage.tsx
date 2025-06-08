'use client'

import { useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import useSWR from 'swr'

import { Button, Card, MenuItem, TablePagination } from '@mui/material'

import { toast } from 'react-toastify'

import { useMajorStore } from '@/stores/major/major'

import majorService from '@/services/major.service'
import PageHeader from '@/components/page-header'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'
import MajorList from './majorList'
import TablePaginationCustom from '@/components/table/TablePagination'
import AddMajor from './addMajor'
import UpdateMajor from './updateMajor'
import AlertDelete from '@/components/alertModal'
import type { Major } from '@/types/management/majorType'
import ViewMajor from './viewMajor'
import AddConcentration from './addConcentration'

export default function MajorPage() {
  const { toogleAddMajor, major, toogleDeleteMajor, openDeleteMajor, setMajor } = useMajorStore()

  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10
  const filterField = searchParams.get('filterField') || ''
  const filterValue = searchParams.get('filterValue') || ''
  const searchKey = searchParams.get('searchKey') || ''

  const fetcher = ['/api/major', page, limit, filterField, filterValue, searchKey]

  const { mutate, data, isLoading } = useSWR(fetcher, () =>
    majorService.getAll(page, limit, filterField, filterValue, searchKey)
  )

  const onChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    const params = new URLSearchParams()

    params.set('page', newPage.toString())
    params.set('limit', limit.toString())

    if (searchKey) {
      params.set('searchKey', searchKey)
    }

    router.push(`?${params.toString()}`, {
      scroll: false
    })
  }

  return (
    <>
      <PageHeader title='Danh sách ngành' />
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
            />
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={toogleAddMajor}
              className='max-sm:is-full'
            >
              Thêm ngành
            </Button>
          </div>
        </div>
        <MajorList
          total={data?.pagination.totalItems || 0}
          limit={limit}
          page={page}
          majors={data?.majors || []}
          loading={isLoading}
        />
        <TablePagination
          component={() => (
            <TablePaginationCustom
              page={page}
              limit={limit}
              total={data?.pagination.totalItems || 0}
              data={data?.majors || []}
            />
          )}
          count={data?.pagination.totalItems || 0}
          page={page - 1}
          rowsPerPage={limit}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={onChangePage}
        />
      </Card>
      <AddMajor mutate={mutate} />
      <UpdateMajor mutate={mutate} />
      <ViewMajor />
      <AddConcentration />
      <AlertDelete
        content={
          <p>
            Bạn có chắc chắn muốn xóa ngành <strong>{major?.majorName}</strong> không?
          </p>
        }
        loading={loading}
        onClose={() => {
          toogleDeleteMajor()
          setMajor({} as Major)
        }}
        open={openDeleteMajor}
        title='Xóa ngành'
        cancelText='Hủy'
        submitText='Xóa'
        onSubmit={async () => {
          setLoading(true)
          if (!major) return

          await majorService.delete(
            major?._id,
            () => {
              toast.success('Xóa ngành thành công')
              setLoading(false)
              toogleDeleteMajor()
              mutate()
            },
            () => {
              setLoading(false)
              toast.error('Xóa ngành thất bại')
            }
          )
        }}
      />
      <AddConcentration />
    </>
  )
}
