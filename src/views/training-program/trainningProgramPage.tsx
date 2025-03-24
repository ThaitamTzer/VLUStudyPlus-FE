'use client'

import { useCallback } from 'react'

import { useSearchParams, useRouter } from 'next/navigation'

import useSWR from 'swr'

import {
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  TablePagination,
  Typography
} from '@mui/material'

import PageHeader from '@/components/page-header'

import trainingProgramService from '@/services/trainingprogram.service'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'
import TableTrainingProgram from './tableTrainingProgram'
import TablePaginationCustom from '@/components/table/TablePagination'
import { useTrainingProgramStore } from '@/stores/trainingProgram.store'
import CreateTrainingProgram from './createTrainingProgram'
import Iconify from '@/components/iconify'
import UpdateTrainingProgram from './updateTrainingProgram'
import DeleteTrainingProgram from './deleteTrainingProgram'
import ImportTrainingProgram from './importTrainingProgram'
import ProgressModal from '@/components/dialogs/progressModal'

export default function TrainingProgramPage() {
  const router = useRouter()

  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10
  const filterField = searchParams.get('filterField') || ''
  const filterValue = searchParams.get('filterValue') || ''
  const searchKey = searchParams.get('searchKey') || ''

  const { toogleCreateTrainingProgram, openImportProgramLoading } = useTrainingProgramStore()

  const fetcher = ['/training-program', page, limit, filterField, filterValue, searchKey]

  const { data, mutate, isLoading } = useSWR(fetcher, () =>
    trainingProgramService.getAll(page, limit, filterField, filterValue, searchKey)
  )

  const handleOpenCreateTrainingProgram = useCallback(() => {
    toogleCreateTrainingProgram()
  }, [toogleCreateTrainingProgram])

  return (
    <>
      <PageHeader title='Danh sách khung chương trình đào tạo' />
      <Card
        sx={{
          mt: 4
        }}
      >
        <CardContent>
          <div>
            <Typography variant='h6'>Chú thích:</Typography>
            <List dense>
              <ListItem>
                <Iconify width={18} icon='icon-park-outline:list-view' color='#6f42c1' />
                <ListItemText primary='Xem chương trình đào tạo' />
              </ListItem>
              <ListItem>
                <Iconify width={18} icon='iconoir:import' color='#198754' />
                <ListItemText primary='Nhập chương trình đào tạo' />
              </ListItem>
            </List>
          </div>
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
      <CreateTrainingProgram mutate={mutate} />
      <UpdateTrainingProgram mutate={mutate} />
      <DeleteTrainingProgram mutate={mutate} />
      <ImportTrainingProgram mutate={mutate} />
      <ProgressModal open={openImportProgramLoading} />
    </>
  )
}
