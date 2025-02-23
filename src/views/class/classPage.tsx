'use client'

import { useState } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import dynamic from 'next/dynamic'

import { Button, Card, CardContent, Grid, MenuItem, TablePagination } from '@mui/material'

import useSWR from 'swr'

import { Flip, toast } from 'react-toastify'

import classService from '@/services/class.service'
import PageHeader from '@/components/page-header'
import ClassList from './classList'
import TablePaginationCustom from '@/components/table/TablePagination'
import DebouncedInput from '@/components/debouncedInput'
import CustomTextField from '@/@core/components/mui/TextField'
import { useClassStore } from '@/stores/class/class'
import UpdateModal from './updateModal'
import AlertDelete from '@/components/alertModal'
import ClassListFilter from './classListFilter'
import EditClassModal from './editClassModal'
import DeleteModal from './deleteModal'
import type { ClassGroupByLecturer } from '@/types/management/classType'

const AddModal = dynamic(() => import('./addModal'))

export default function ClassPage() {
  const {
    toogleOpenAddClassModal,
    classRoom,
    toogleOpenDeleteClassModal,
    openDeleteClassModal,
    setClassFilter,
    classFilter
  } = useClassStore()

  const [loading, setLoading] = useState<boolean>(false)

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
    params.set('typeList', typeList)

    if (searchKey) {
      params.set('searchKey', searchKey)
    }

    router.push(`?${params.toString()}`, {
      scroll: false
    })
  }

  const { data, isLoading, mutate } = useSWR(
    ['/api/classData', page, limit, filterField, filterValue, sortField, sortOrder, typeList, searchKey],
    () => classService.getAll(page, limit, filterField, filterValue, sortField, sortOrder, typeList, searchKey),
    {
      revalidateOnFocus: false,
      onSuccess: newData => {
        if (typeList === 'groupedByLecture') {
          const convertData = newData.data as unknown as ClassGroupByLecturer[]

          const foundClass = convertData.find(item => item.lectureId._id === classFilter?.lectureId._id)

          if (foundClass) {
            setClassFilter(foundClass)
          }
        }
      }
    }
  )

  console.log('classFilter', classFilter)

  const onDelete = async () => {
    if (!classRoom) return
    const toastId = toast.loading('Đang xóa lớp niên chế')

    setLoading(true)
    await classService.delete(
      classRoom._id,
      () => {
        mutate()
        toast.update(toastId, {
          render: 'Xóa lớp niên chế thành công',
          type: 'success',
          isLoading: false,
          transition: Flip,
          autoClose: 3000
        })
        setLoading(false)
      },
      err => {
        toast.update(toastId, {
          render: err.message,
          type: 'error',
          isLoading: false,
          transition: Flip,
          autoClose: 3000
        })
        setLoading(false)
      }
    )
  }

  return (
    <>
      <PageHeader title='Danh sách lớp niên chế' />
      <Card
        sx={{
          mt: 4
        }}
      >
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={4}>
              <CustomTextField
                select
                fullWidth
                SelectProps={{
                  displayEmpty: true
                }}
                onChange={e => {
                  const params = new URLSearchParams()

                  params.set('page', '1')
                  params.set('limit', limit.toString())
                  params.set('filterField', e.target.value)
                  params.set('filterValue', filterValue)
                  params.append('typeList', e.target.value)

                  if (searchKey) {
                    params.set('searchKey', searchKey)
                  }

                  router.push(`?${params.toString()}`, {
                    scroll: false
                  })
                }}
                value={typeList}
              >
                <MenuItem value=''>Xem theo lớp</MenuItem>
                <MenuItem value='groupedByLecture'>Xem theo giảng viên</MenuItem>
              </CustomTextField>
            </Grid>
          </Grid>
        </CardContent>
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
                params.set('typeList', typeList)

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
        {typeList === 'groupedByLecture' ? (
          <ClassListFilter
            data={data?.data || []}
            handleSort={handleSort}
            sortField={sortField}
            sortOrder={sortOrder}
            limit={limit}
            loading={isLoading}
            page={page}
            total={data?.pagination.totalItems || 0}
          />
        ) : (
          <ClassList
            classes={data?.data || []}
            total={data?.pagination.totalItems || 0}
            loading={isLoading}
            limit={limit}
            page={page}
            sortField={sortField}
            sortOrder={sortOrder}
            handleSort={handleSort}
          />
        )}

        <TablePagination
          component={() => (
            <TablePaginationCustom
              data={data?.data || []}
              page={page}
              limit={limit}
              filterField={filterField}
              filterValue={filterValue}
              total={data?.pagination.totalItems || 0}
              sortField={sortField}
              sortOrder={sortOrder}
              typeList={typeList}
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
            params.set('typeList', typeList)

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
      <EditClassModal />
      <DeleteModal mutate={mutate} />
      <AlertDelete
        content={
          <p>
            Bạn có chắc chắn muốn xóa lớp niên chế <strong>{classRoom?.classId}</strong> không?
          </p>
        }
        open={openDeleteClassModal}
        onClose={toogleOpenDeleteClassModal}
        loading={loading}
        title='Xóa lớp niên chế'
        onSubmit={onDelete}
        submitText='Xóa'
        submitColor='error'
      />
    </>
  )
}
