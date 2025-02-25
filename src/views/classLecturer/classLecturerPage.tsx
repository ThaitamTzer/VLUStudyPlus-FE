'use client'

import { useRouter } from 'next/navigation'

import { Card, CardContent, CardHeader, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import useSWR from 'swr'

import PageHeader from '@/components/page-header'
import classLecturerService from '@/services/classLecturer.service'
import Iconify from '@/components/iconify'
import type { ClassLecturer } from '@/types/management/classLecturerType'
import ImportStudent from '../classStudent/importAddStudent'
import { useClassStudentStore } from '@/stores/classStudent/classStudent.store'
import PreviewImport from '../classStudent/importResult'

const ClassCard = ({ item }: { item: ClassLecturer }) => {
  const router = useRouter()

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
                <Tooltip title='Xem danh sách sinh viên'>
                  <IconButton
                    size='small'
                    onClick={() => {
                      const param = new URLSearchParams()

                      param.append('classCode', item.classId)

                      router.push(`/classStudent?${param.toString()}`)
                    }}
                  >
                    <Iconify icon='solar:eye-outline' className='text-black' />
                  </IconButton>
                </Tooltip>
                {!item.statusImport && (
                  <Tooltip title='Import sinh viên'>
                    <IconButton
                      size='small'
                      onClick={() => {
                        useClassStudentStore.getState().toogleImportStudent()
                        useClassStudentStore.getState().setClassCode(item.classId)
                      }}
                    >
                      <Iconify icon='mynaui:plus-solid' className='text-black' />
                    </IconButton>
                  </Tooltip>
                )}
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

export default function ClassLecturerPage() {
  const { data, mutate } = useSWR('/api/class/view-list-class-of-CVHT', classLecturerService.getList)
  const { classCode } = useClassStudentStore()

  return (
    <>
      <PageHeader title='Danh sách lớp' />
      <Grid container spacing={5}>
        {data && data.map(item => <ClassCard key={item._id} item={item} />)}
        {data && data.length === 0 && (
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography variant='h4' color='textSecondary'>
                  Hiện tại bạn chưa được phân công lớp nào
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
      <ImportStudent mutate={mutate} classCode={classCode} />
      <PreviewImport />
    </>
  )
}
