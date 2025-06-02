'use client'

import { useCallback } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import dynamic from 'next/dynamic'

import useSWR from 'swr'

import { Button, Card, MenuItem, TablePagination, Typography, Box, Grid } from '@mui/material'

import PageHeader from '@/components/page-header'

import trainingProgramService from '@/services/trainingprogram.service'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'
import TablePaginationCustom from '@/components/table/TablePagination'
import { useTrainingProgramStore } from '@/stores/trainingProgram.store'

import Iconify from '@/components/iconify'
import ProgressModal from '@/components/dialogs/progressModal'

const TableTrainingProgram = dynamic(() => import('./tableTrainingProgram'))
const UpdateTrainingProgram = dynamic(() => import('./updateTrainingProgram'), { ssr: false })
const DeleteTrainingProgram = dynamic(() => import('./deleteTrainingProgram'), { ssr: false })
const ImportTrainingProgram = dynamic(() => import('./importTrainingProgram'), { ssr: false })

const ViewTrainingProgramByFrame = dynamic(() => import('./viewTrainingProgramByFrame/viewTrainingProgramByFrame'), {
  ssr: false
})

const AddTrainingProgramStepByStepModal = dynamic(() => import('./addTrainingProgramStepByStepModal'), { ssr: false })

export default function TrainingProgramPage() {
  const router = useRouter()

  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10
  const filterField = searchParams.get('filterField') || ''
  const filterValue = searchParams.get('filterValue') || ''
  const searchKey = searchParams.get('searchKey') || ''

  const { toogleCreateTrainingProgram, openImportProgramLoading, isComplete, isProgress, toogleImportProgramLoading } =
    useTrainingProgramStore()

  const fetcher = ['/training-program', page, limit, filterField, filterValue, searchKey]

  const { data, mutate, isLoading } = useSWR(fetcher, () =>
    trainingProgramService.getAll(page, limit, filterField, filterValue, searchKey)
  )

  const handleOpenCreateTrainingProgram = useCallback(() => {
    toogleCreateTrainingProgram()
  }, [toogleCreateTrainingProgram])

  console.log('openImportProgramLoading', openImportProgramLoading)
  console.log('isComplete', isComplete)

  return (
    <>
      <PageHeader title='Danh sách khung chương trình đào tạo' />
      <Card sx={{ mt: 4, mb: 4, borderRadius: 2, boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)' }}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(32, 146, 236, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 12px 0 rgba(32, 146, 236, 0.2)'
                  }
                }}
              >
                <Box
                  sx={{
                    mr: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'rgba(32, 146, 236, 0.2)',
                    p: 1,
                    borderRadius: '50%'
                  }}
                >
                  <Iconify icon='mingcute:information-fill' color='#2092ec' fontSize={24} />
                </Box>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  <strong>Xem chi tiết khung chương trình</strong>
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(46, 204, 113, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 12px 0 rgba(46, 204, 113, 0.2)'
                  }
                }}
              >
                <Box
                  sx={{
                    mr: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'rgba(46, 204, 113, 0.2)',
                    p: 1,
                    borderRadius: '50%'
                  }}
                >
                  <Iconify icon='fluent:table-add-20-regular' color='#2ecc71' fontSize={24} />
                </Box>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  <strong>Import khung chương trình</strong>
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(241, 196, 15, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 12px 0 rgba(241, 196, 15, 0.2)'
                  }
                }}
              >
                <Box
                  sx={{
                    mr: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'rgba(241, 196, 15, 0.2)',
                    p: 1,
                    borderRadius: '50%'
                  }}
                >
                  <Iconify icon='solar:pen-2-linear' color='#f1c40f' fontSize={24} />
                </Box>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  <strong>Cập nhật khung chương trình</strong>
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: 'rgba(231, 76, 60, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 4px 12px 0 rgba(231, 76, 60, 0.2)'
                  }
                }}
              >
                <Box
                  sx={{
                    mr: 2,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    bgcolor: 'rgba(231, 76, 60, 0.2)',
                    p: 1,
                    borderRadius: '50%'
                  }}
                >
                  <Iconify icon='solar:trash-bin-2-linear' color='#e74c3c' fontSize={24} />
                </Box>
                <Typography variant='body2' sx={{ fontWeight: 600 }}>
                  <strong>Xóa khung chương trình</strong>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
      <Card sx={{ mt: 4, boxShadow: 5 }}>
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

                if (value) {
                  params.set('searchKey', value as string)
                }

                router.push(`?${params.toString()}`)
              }}
              placeholder='Tìm kiếm'
              className='max-sm:is-full sm:is-[300px]'
            />
            <Button
              onClick={handleOpenCreateTrainingProgram}
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              className='max-sm:is-full'
            >
              Thêm khung
            </Button>
          </div>
        </div>
        <TableTrainingProgram
          data={data?.data || []}
          limit={limit}
          loading={isLoading}
          page={page}
          total={data?.pagination.totalItems || 0}
        />
        <TablePagination
          component={() => (
            <TablePaginationCustom
              data={data?.data || []}
              page={page}
              limit={limit}
              filterField={filterField}
              filterValue={filterValue}
              total={data?.pagination.totalItems || 0}
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

            if (searchKey) {
              params.set('searchKey', searchKey)
            }

            router.replace(`?${params.toString()}`, {
              scroll: false
            })
          }}
        />
      </Card>
      <AddTrainingProgramStepByStepModal mutate={mutate} />
      <UpdateTrainingProgram mutate={mutate} />
      <DeleteTrainingProgram mutate={mutate} />
      <ImportTrainingProgram mutate={mutate} />
      <ViewTrainingProgramByFrame />
      <ProgressModal
        open={openImportProgramLoading}
        isCompleted={isComplete}
        isProcessing={isProgress}
        onClose={toogleImportProgramLoading}
        autoCloseDelay={2000}
      />
    </>
  )
}
