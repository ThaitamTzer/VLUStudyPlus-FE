'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { Button, Card, MenuItem, TablePagination } from '@mui/material'

import useSWR from 'swr'

import PageHeader from '@/components/page-header'

import studentService from '@/services/student.service'

import { useStudentStore } from '@/stores/student/student'
import StudentList from './studentList'
import TablePaginationCustom from '@/components/table/TablePagination'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'
import AddStudent from './addStudent'

export default function StudentPage() {
  const { students, setStudents, total, setTotal, toogleAddStudent } = useStudentStore()

  const router = useRouter()

  const searchParams = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 10
  const filterField = searchParams.get('filterField') || ''
  const filterValue = searchParams.get('filterValue') || ''
  const searchKey = searchParams.get('searchKey') || ''

  const fetcher = ['/api/student', page, limit, filterField, filterValue, searchKey]

  const { mutate } = useSWR(fetcher, () => studentService.getList(page, limit, filterField, filterValue, searchKey), {
    onSuccess: data => {
      setStudents(data.students)
      setTotal(data.pagination.totalItems)
    }
  })

  console.log(students)

  return (
    <>
      <PageHeader title='Danh sách sinh viên' />
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
              onClick={toogleAddStudent}
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              className='max-sm:is-full'
            >
              Thêm sinh viên
            </Button>
          </div>
        </div>

        <StudentList limit={limit} page={page} students={students} />
        <TablePagination
          component={() => (
            <TablePaginationCustom data={students} page={page} limit={limit} total={total} searchKey={searchKey} />
          )}
          count={total}
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

            router.push(`?${params.toString()}`)
          }}
        />
      </Card>
      <AddStudent mutate={mutate} />
    </>
  )
}
