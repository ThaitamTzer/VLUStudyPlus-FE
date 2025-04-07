'use client'

import { useSearchParams, useRouter } from 'next/navigation'

import { Button, Card, CardContent, Grid, MenuItem, TablePagination } from '@mui/material'

import useSWR from 'swr'

import { TabPanel } from '@mui/lab'

import classStudentService from '@/services/classStudent.service'

import PageHeader from '@/components/page-header'
import ClassStudentList from './list'
import TablePaginationCustom from '@/components/table/TablePagination'
import CustomTextField from '@/@core/components/mui/TextField'
import classLecturerService from '@/services/classLecturer.service'
import DebouncedInput from '@/components/debouncedInput'
import ImportStudent from './importAdd'
import { useClassStudentStore } from '@/stores/classStudent/classStudent.store'
import PreviewImport from './importResult'
import AddModal from './addModal'
import ManualAddStudent from './manualAddStudent'
import UpdateAddStudent from './updateStudent'
import ProgressModal from '../../components/dialogs/progressModal'

export default function ClassStudentPage() {
  const { setOpenAddModal, openProgress, isCompleted, isProcessing, toogleProgress } = useClassStudentStore()

  const router = useRouter()

  const searchParams = useSearchParams()
  const classCode = searchParams.get('classCode') || ''
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10
  const sortField = searchParams.get('sortField') || ''
  const sortOrder = searchParams.get('sortOrder') || ''
  const searchKey = searchParams.get('searchKey') || ''

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortOrder === 'asc'
    const newSortOrder = isAsc ? 'desc' : 'asc'

    const params = new URLSearchParams()

    params.set('classCode', classCode)
    params.set('page', '1')
    params.set('limit', limit.toString())
    params.set('sortField', field)
    params.set('sortOrder', newSortOrder)

    if (searchKey) {
      params.set('searchKey', searchKey)
    }

    router.push(`?${params.toString()}`, {
      scroll: false
    })
  }

  const fetcher = ['/api/student/view-list-student-of-CVHT', classCode, page, limit, sortField, sortOrder, searchKey]

  const { data, mutate, isLoading } = useSWR(
    fetcher,
    () => classStudentService.getListByClassCode(classCode, page, limit, sortField, sortOrder, searchKey),
    {
      revalidateOnFocus: false
    }
  )

  const { data: classOption } = useSWR('classOption', classLecturerService.getList)

  return (
    <>
      <PageHeader title='Danh sách sinh viên' />
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={4}>
              <CustomTextField
                select
                fullWidth
                value={classCode}
                label='Lọc theo lớp'
                SelectProps={{
                  displayEmpty: true,
                  MenuProps: {
                    sx: {
                      maxHeight: 300
                    }
                  }
                }}
                onChange={e => {
                  const params = new URLSearchParams()

                  params.set('page', '1')
                  params.set('limit', limit.toString())
                  params.set('classCode', e.target.value)

                  router.push(`?${params.toString()}`, {
                    scroll: false
                  })
                }}
              >
                <MenuItem value=''>Chọn một lớp để xem</MenuItem>
                {classOption?.map(option => (
                  <MenuItem key={option.classId} value={option.classId}>
                    {option.classId}
                  </MenuItem>
                ))}
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

              params.set('classCode', classCode)
              params.set('page', '1')
              params.set('limit', e.target.value)
              params.set('sortField', sortField)
              params.set('sortOrder', sortOrder)

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

                params.set('classCode', classCode)
                params.set('page', '1')
                params.set('limit', limit.toString())
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
              onClick={() => setOpenAddModal(true)}
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              className='max-sm:is-full'
            >
              Thêm sinh viên
            </Button>
          </div>
        </div>
        <ClassStudentList
          data={data?.students}
          loading={isLoading}
          total={data?.pagination.totalItems || 0}
          limit={limit}
          page={page}
          sortField={sortField}
          sortOrder={sortOrder}
          handleSort={handleSort}
        />
        <TablePagination
          component={() => (
            <TablePaginationCustom
              data={data?.students || []}
              page={page}
              limit={limit}
              total={data?.pagination.totalItems || 0}
              sortField={sortField}
              sortOrder={sortOrder}
              searchKey={searchKey}
              classCode={classCode}
            />
          )}
          count={data?.pagination.totalItems || 0}
          page={page - 1}
          rowsPerPage={limit}
          rowsPerPageOptions={[10, 25, 50]}
          onPageChange={(_, newPage) => {
            const params = new URLSearchParams()

            params.set('classCode', classCode)
            params.set('page', (newPage + 1).toString())
            params.set('limit', limit.toString())
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
      <ProgressModal
        open={openProgress}
        isProcessing={isProcessing}
        isCompleted={isCompleted}
        onClose={toogleProgress}
      />
      <AddModal>
        <TabPanel value='1'>
          <ManualAddStudent mutate={mutate} />
        </TabPanel>
        <TabPanel value='2'>
          <ImportStudent mutate={mutate} classCode={classOption || []} />
        </TabPanel>
      </AddModal>
      <UpdateAddStudent mutate={mutate} />
      <PreviewImport />
    </>
  )
}
