'use client'

import { useCallback } from 'react'

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
import gradeService from '@/services/grade.service'

const ImportStudent = dynamic(() => import('./importAdd'), { ssr: false })
const PreviewImport = dynamic(() => import('./importResult'), { ssr: false })
const AddModal = dynamic(() => import('./addModal'), { ssr: false })
const ManualAddStudent = dynamic(() => import('./manualAddStudent'), { ssr: false })
const UpdateAddStudent = dynamic(() => import('./updateStudent'), { ssr: false })
const ProgressModal = dynamic(() => import('../../components/dialogs/progressModal'), { ssr: false })
const UpdateGradeByLec = dynamic(() => import('../grade/UpdateGradeByLec'), { ssr: false })
const ViewGradeDetailByLec = dynamic(() => import('../grade/ViewGradeDetailByLec'), { ssr: false })
const ClassStudentList = dynamic(() => import('./list'), { ssr: false })
const GradeList = dynamic(() => import('../grade/listGrade'), { ssr: false })
const ModalUpdateGradeByLec = dynamic(() => import('../grade/ModalUpdateGradeByLec'), { ssr: false })

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
  const pageGrade = Number(searchParams.get('pageGrade')) || 1
  const limitGrade = Number(searchParams.get('limitGrade')) || 10
  const filterFieldGrade = searchParams.get('filterFieldGrade') || ''
  const filterValueGrade = searchParams.get('filterValueGrade') || ''
  const sortFieldGrade = searchParams.get('sortFieldGrade') || ''
  const sortOrderGrade = searchParams.get('sortOrderGrade') || ''
  const searchKeyGrade = searchParams.get('searchKeyGrade') || ''

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

  const fetcherGrade = [
    '/api/grade/view-grade-GV',
    idClass,
    pageGrade,
    limitGrade,
    filterFieldGrade,
    filterValueGrade,
    sortFieldGrade,
    sortOrderGrade,
    searchKeyGrade
  ]

  const {
    data: gradeData,
    isLoading: isLoadingGrade,
    mutate: mutateGrade
  } = useSWR(
    idClass ? fetcherGrade : null,
    () =>
      gradeService.getGradeByClassCode(
        idClass,
        pageGrade,
        limitGrade,
        filterFieldGrade,
        filterValueGrade,
        sortFieldGrade,
        sortOrderGrade,
        searchKeyGrade
      ),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true
    }
  )

  const handleViewGrade = useCallback(() => {
    if (typeList !== 'grade') {
      const params = new URLSearchParams()
      const classCodetoId = classOption?.find(option => option.classId === classCode)?._id || ''

      params.set('idClass', classCodetoId)
      params.set('pageGrade', '1')
      params.set('limitGrade', '10')
      params.set('classCode', classCode)
      params.set('typeList', 'grade')
      router.push(`?${params.toString()}`, {
        scroll: false
      })
    } else {
      const params = new URLSearchParams()

      params.set('classCode', classCode)
      params.set('typeList', '')
      router.push(`?${params.toString()}`, {
        scroll: false
      })
    }
  }, [classCode, router, typeList, classOption])

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

                if (typeList === 'grade') {
                  params.set('idClass', idClass || '')
                  params.set('pageGrade', '1')
                  params.set('limitGrade', limitGrade.toString())
                  params.set('classCode', classCode)
                  params.set('typeList', 'grade')
                  params.set('searchKeyGrade', value as string)
                }

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
            {typeList !== 'grade' && (
              <Button
                onClick={() => setOpenAddModal(true)}
                variant='contained'
                startIcon={<i className='tabler-plus' />}
                className='max-sm:is-full'
              >
                Thêm sinh viên
              </Button>
            )}
            <Button
              onClick={handleViewGrade}
              variant='contained'
              sx={{ backgroundColor: '#7F55B1', color: '#fff' }}
              startIcon={<i className='tabler-chart-bar' />}
              className='max-sm:is-full'
            >
              {typeList === 'grade' ? 'Bảng sinh viên' : 'Bảng kết quả'}
            </Button>
          </div>
        </div>
        {typeList === 'grade' ? (
          <>
            <GradeList
              data={gradeData?.data || []}
              page={page}
              limit={limit}
              sortField={sortField}
              sortOrder={sortOrder}
              handleSort={handleSort}
              total={gradeData?.pagination.totalItems || 0}
              searchKey={searchKey}
              classCode={classCode}
              loading={isLoadingGrade}
            />
          </>
        ) : (
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
        )}
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
      <UpdateGradeByLec mutate={mutateGrade} />
      <ViewGradeDetailByLec />
      <ModalUpdateGradeByLec />
    </>
  )
}
