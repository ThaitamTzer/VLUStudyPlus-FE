'use client'

import { useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import { Button, Card, MenuItem, TablePagination } from '@mui/material'

import useSWR from 'swr'

import { toast } from 'react-toastify'

import PageHeader from '@/components/page-header'

import studentService from '@/services/student.service'

import { useStudentStore } from '@/stores/student/student'
import StudentList from './studentList'
import TablePaginationCustom from '@/components/table/TablePagination'
import CustomTextField from '@/@core/components/mui/TextField'
import DebouncedInput from '@/components/debouncedInput'
import AddStudent from './addStudent'
import UpdateStudent from './updateStudent'
import AlertModal from '@/components/alertModal'

export default function StudentPage() {
  const {
    students,
    setStudents,
    total,
    setTotal,
    toogleAddStudent,
    student,
    toogleBlockStudent,
    toogleUnBlockStudent,
    openUnBlockStudent,
    openBlockStudent
  } = useStudentStore()

  const [loading, setLoading] = useState<boolean>(false)

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
      <UpdateStudent mutate={mutate} />
      <AlertModal
        title='Xác nhận khóa sinh viên'
        content={
          <div className='space-y-4'>
            <p>
              Bạn có chắc chắn muốn khóa sinh viên <strong>{student?.userName}</strong> với mã sinh viên là{' '}
              <strong>{student?.userId}</strong> không?
            </p>
            <p className='text-red-500'>
              <strong>Lưu ý:</strong> Sinh viên sẽ không thể truy cập vào hệ thống nếu bạn khóa tài khoản của họ.
            </p>
          </div>
        }
        loading={loading}
        submitText='Khóa'
        cancelText='Hủy'
        onSubmit={async () => {
          if (!student) return

          setLoading(true)
          await studentService.block(
            student._id,
            true,
            () => {
              setLoading(false)
              mutate()
              toogleBlockStudent()
              toast.success('Khóa sinh viên thành công')
            },
            err => {
              setLoading(false)
              toast.error(err.message)
            }
          )
        }}
        onClose={() => {
          toogleBlockStudent()
        }}
        open={openBlockStudent}
      />
      <AlertModal
        title='Xác nhận mở khóa sinh viên'
        content={
          <div className='space-y-4'>
            <p>
              Bạn có chắc chắn muốn mở khóa sinh viên <strong>{student?.userName}</strong> với mã sinh viên là{' '}
              <strong>{student?.userId}</strong> không?
            </p>
          </div>
        }
        loading={loading}
        submitText='Mở khóa'
        cancelText='Hủy'
        submitColor='primary'
        onSubmit={async () => {
          if (!student) return

          setLoading(true)
          await studentService.block(
            student._id,
            false,
            () => {
              setLoading(false)
              mutate()
              toogleUnBlockStudent()
              toast.success('Mở khóa sinh viên thành công')
            },
            err => {
              setLoading(false)
              toast.error(err.message)
            }
          )
        }}
        onClose={() => {
          toogleUnBlockStudent()
        }}
        open={openUnBlockStudent}
      />
    </>
  )
}
