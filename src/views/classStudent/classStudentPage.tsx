'use client'

import { useSearchParams, useRouter } from 'next/navigation'

import dynamic from 'next/dynamic'

import { Button, Card, CardContent, Grid, MenuItem } from '@mui/material'

import useSWR from 'swr'

import { TabPanel } from '@mui/lab'

import classStudentService from '@/services/classStudent.service'

import PageHeader from '@/components/page-header'
import CustomTextField from '@/@core/components/mui/TextField'
import classLecturerService from '@/services/classLecturer.service'
import DebouncedInput from '@/components/debouncedInput'
import { useClassStudentStore } from '@/stores/classStudent/classStudent.store'

const ImportStudent = dynamic(() => import('./importAdd'), { ssr: false })
const PreviewImport = dynamic(() => import('./importResult'), { ssr: false })
const AddModal = dynamic(() => import('./addModal'), { ssr: false })
const ManualAddStudent = dynamic(() => import('./manualAddStudent'), { ssr: false })
const UpdateAddStudent = dynamic(() => import('./updateStudent'), { ssr: false })
const ProgressModal = dynamic(() => import('../../components/dialogs/progressModal'), { ssr: false })
const ClassStudentList = dynamic(() => import('./list'), { ssr: false })

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

  const typeList = searchParams.get('typeList') || ''

  const idClass = searchParams.get('idClass') || ''
  const limitGrade = Number(searchParams.get('limitGrade')) || 10

  const handleSort = (field: string) => {
    const isAsc = sortField === field && sortOrder === 'asc'
    const newSortOrder = isAsc ? 'desc' : 'asc'

    const params = new URLSearchParams()

    params.set('classCode', classCode)
    params.set('page', '1')
    params.set('limit', limit.toString())
    params.set('sortField', field)
    params.set('sortOrder', newSortOrder)

    if (typeList === 'grade') {
      params.set('idClass', idClass || '')
      params.set('pageGrade', '1')
      params.set('limitGrade', limitGrade.toString())
      params.set('classCode', classCode)
      params.set('typeList', 'grade')
    }

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

  const handleClassChange = (selectedClassId: string) => {
    const selectedClass = classOption?.find(option => option.classId === selectedClassId)
    const params = new URLSearchParams()

    if (typeList === 'grade') {
      params.set('idClass', selectedClass?._id || '')
      params.set('pageGrade', '1')
      params.set('limitGrade', limitGrade.toString())
      params.set('classCode', selectedClassId)
      params.set('typeList', 'grade')
    } else {
      params.set('classCode', selectedClassId)
      params.set('page', '1')
      params.set('limit', limit.toString())
      params.set('typeList', 'student')
    }

    router.push(`?${params.toString()}`, {
      scroll: false
    })
  }

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
                onChange={e => handleClassChange(e.target.value)}
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

                if (value && typeList !== 'grade') {
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
          searchKey={searchKey}
          classCode={classCode}
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
