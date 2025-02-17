'use client'

import { useSearchParams, useRouter } from 'next/navigation'

import dynamic from 'next/dynamic'

import { Button, Card, MenuItem, TablePagination } from '@mui/material'

import useSWR from 'swr'

import classService from '@/services/class.service'
import PageHeader from '@/components/page-header'
import ClassList from './classList'
import TablePaginationCustom from '@/components/table/TablePagination'
import DebouncedInput from '@/components/debouncedInput'
import CustomTextField from '@/@core/components/mui/TextField'
import { useClassStore } from '@/stores/class/class'
import UpdateModal from './updateModal'

const AddModal = dynamic(() => import('./addModal'))

export default function ClassPage() {
  const { toogleOpenAddClassModal } = useClassStore()

  const router = useRouter()

  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10
  const filterField = searchParams.get('filterField') || ''
  const filterValue = searchParams.get('filterValue') || ''
  const sortField = searchParams.get('sortField') || ''
  const sortOrder = searchParams.get('sortOrder') || ''
  const typeList = searchParams.get('typeList') || ''
  const searchKey = searchParams.get('searchKey') || ''

  const params = {
    page,
    limit,
    filterField,
    filterValue,
    sortField,
    sortOrder,
    typeList,
    searchKey
  }

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortOrder === 'asc'
    const newSortOrder = isAsc ? 'desc' : 'asc'

    const params = new URLSearchParams()

    params.set('page', '1')
    params.set('limit', limit.toString())
    params.set('filterField', filterField)
    params.set('filterValue', filterValue)
    params.set('sortField', field)
    params.set('sortOrder', newSortOrder)

    if (searchKey) {
      params.set('searchKey', searchKey)
    }

    router.push(`?${params.toString()}`, {
      scroll: false
    })
  }

  const { data, isLoading, mutate } = useSWR(
    ['/api/class', params],
    () => classService.getAll(page, limit, filterField, filterValue, sortField, sortOrder, typeList, searchKey),
    {
      revalidateOnFocus: false
    }
  )

  return (
    <>
      <PageHeader title='Danh sách lớp niên chế' />
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
              params.set('filterField', filterField)
              params.set('filterValue', filterValue)

              if (searchKey) {
                params.set('searchKey', searchKey)
              }

              router.push(`?${params.toString()}`, {
                scroll: false
              })
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
                params.set('filterField', filterField)
                params.set('filterValue', filterValue)
                params.set('sortField', sortField)
                params.set('sortOrder', sortOrder)

                if (value) {
                  params.set('searchKey', value as string)
                }

                router.push(`?${params.toString()}`)
              }}
              placeholder='Tìm kiếm'
              className='max-sm:is-full sm:is-[300px]'
            />
            <Button
              onClick={toogleOpenAddClassModal}
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              className='max-sm:is-full'
            >
              Thêm lớp niên chế
            </Button>
          </div>
        </div>
        <ClassList
          classes={data?.classs || []}
          total={data?.pagination.totalItems || 0}
          loading={isLoading}
          limit={params.limit}
          page={params.page}
          sortField={params.sortField}
          sortOrder={params.sortOrder}
          handleSort={handleSort}
        />
        <TablePagination
          component={() => (
            <TablePaginationCustom
              data={data?.classs || []}
              page={params.page}
              limit={params.limit}
              filterField={params.filterField}
              filterValue={params.filterValue}
              total={data?.pagination.totalItems || 0}
              sortField={params.sortField}
              sortOrder={params.sortOrder}
              searchKey={searchKey}
            />
          )}
          count={data?.pagination.totalItems || 0}
          page={page - 1}
          rowsPerPage={limit}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={(_, newPage) => {
            const params = new URLSearchParams()

            params.set('page', (newPage + 1).toString())
            params.set('limit', limit.toString())
            params.set('filterField', filterField)
            params.set('filterValue', filterValue)
            params.set('sortField', sortField)
            params.set('sortOrder', sortOrder)

            if (searchKey) {
              params.set('searchKey', searchKey)
            }

            router.replace(`?${params.toString()}`, {
              scroll: false
            })
          }}
        />
      </Card>
      <AddModal mutate={mutate} />
      <UpdateModal mutate={mutate} />
    </>
  )
}
