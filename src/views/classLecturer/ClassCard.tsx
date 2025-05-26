'use client'

import { useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { Card, IconButton, CardHeader, Stack, Tooltip, Grid, Typography, CardContent } from '@mui/material'

import Iconify from '@/components/iconify'

import { useClassStudentStore } from '@/stores/classStudent/classStudent.store'
import { useGradeStore } from '@/stores/grade/grade.store'
import type { ClassLecturer } from '@/types/management/classLecturerType'

export const ClassCard = ({ item }: { item: ClassLecturer }) => {
  const router = useRouter()
  const { setOpenAddModal, setClassCode } = useClassStudentStore()
  const { toogleViewGrade, setIdClass, setCohortId, setClassLecturer } = useGradeStore()

  const handleViewGrade = useCallback(
    (classId: string, cohortId: string, classLecturer: ClassLecturer) => {
      toogleViewGrade()
      setIdClass(classId)
      setCohortId(cohortId)
      setClassLecturer(classLecturer)
    },
    [toogleViewGrade, setIdClass, setCohortId, setClassLecturer]
  )

  return (
    <Grid item xs={12} sm={6} md={4} key={item._id}>
      <Card>
        <CardHeader
          title={item.classId}
          sx={{
            pb: 2
          }}
          action={
            <>
              <Stack spacing={1} direction='row'>
                <Tooltip title='Xem danh sách điểm'>
                  <IconButton size='small' onClick={() => handleViewGrade(item._id, item.cohortId, item)}>
                    <Iconify
                      icon='tabler-chart-bar'
                      className='text-purple-700
                    '
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Xem danh sách sinh viên'>
                  <IconButton
                    size='small'
                    onClick={() => {
                      const param = new URLSearchParams()

                      param.append('classCode', item.classId)

                      router.push(`/classStudent?${param.toString()}`)
                    }}
                  >
                    <Iconify icon='solar:eye-outline' className='text-blue-700' />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Thêm sinh viên'>
                  <IconButton
                    size='small'
                    onClick={() => {
                      setOpenAddModal(true)
                      setClassCode(item.classId)
                    }}
                  >
                    <Iconify icon='mynaui:plus-solid' className='text-green-700' />
                  </IconButton>
                </Tooltip>
              </Stack>
            </>
          }
        />
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='body1' color='textPrimary' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Tổng số sinh viên: {item.numberStudent} <Iconify icon={'mynaui:users'} />
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body1' color='textPrimary'>
                Danh sách sinh viên:{' '}
                {item.statusImport ? (
                  <strong className='text-green-500'> Đã thêm</strong>
                ) : (
                  <strong className='text-gray-900'> Chưa thêm</strong>
                )}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Grid>
  )
}
